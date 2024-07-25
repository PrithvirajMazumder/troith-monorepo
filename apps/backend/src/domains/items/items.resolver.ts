import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { ItemsService } from '@/domains/items/items.service'
import { Item } from '@/domains/items/entities/item.entity'
import { CreateItemInput } from '@/domains/items/dto/create-item.input'
import { UpdateItemInput } from '@/domains/items/dto/update-item.input'
import { UomsService } from '@/domains/uoms/uoms.service'
import { CompaniesService } from '@/domains/companies/companies.service'
import { TaxesService } from '@/domains/taxes/taxes.service'
import { Company } from '@/domains/companies/entities/company.entity'
import { Tax } from '@/domains/taxes/entities/tax.entity'
import { Uom } from '@/domains/uoms/entities/uom.entity'

@Resolver(() => Item)
export class ItemsResolver {
  constructor(
    private readonly itemsService: ItemsService,
    private readonly uomsService: UomsService,
    private readonly companiesService: CompaniesService,
    private readonly taxesService: TaxesService
  ) {}

  @Mutation(() => Item)
  createItem(@Args('createItemInput') createItemInput: CreateItemInput) {
    return this.itemsService.create(createItemInput)
  }

  @Query(() => [Item], { name: 'items' })
  findAllByCompanyId(@Args('companyId') companyId: string) {
    return this.itemsService.findAllByCompanyId(companyId)
  }

  @Query(() => Item, { name: 'item' })
  findOne(@Args('id') id: string) {
    return this.itemsService.findOne(id)
  }

  @Mutation(() => Item)
  updateItem(@Args('updateItemInput') updateItemInput: UpdateItemInput) {
    return this.itemsService.update(updateItemInput.id, updateItemInput)
  }

  @Mutation(() => Item)
  removeItem(@Args('id') id: string) {
    return this.itemsService.remove(id)
  }

  @ResolveField('company', () => Company, { nullable: true })
  getCompany(@Parent() item: Item) {
    const { companyId } = item
    return this.companiesService.findOne(companyId)
  }

  @ResolveField('tax', () => Tax)
  getTax(@Parent() item: Item) {
    const { taxId } = item
    return this.taxesService.findOne(taxId)
  }

  @ResolveField('uom', () => Uom)
  async getUom(@Parent() item: Item) {
    const { uomId } = item
    return await this.uomsService.findOne(uomId)
  }
}
