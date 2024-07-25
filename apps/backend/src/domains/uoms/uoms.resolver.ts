import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { UomsService } from '@/domains/uoms/uoms.service'
import { Uom } from '@/domains/uoms/entities/uom.entity'
import { CreateUomInput } from '@/domains/uoms/dto/create-uom.input'
import { UpdateUomInput } from '@/domains/uoms/dto/update-uom.input'
import { CompaniesService } from '@/domains/companies/companies.service'
import { Company } from '@/domains/companies/entities/company.entity'

@Resolver(() => Uom)
export class UomsResolver {
  public constructor(
    private readonly uomsService: UomsService,
    private readonly companiesService: CompaniesService
  ) {}

  @Mutation(() => Uom)
  createUom(@Args('createUomInput') createUomInput: CreateUomInput) {
    return this.uomsService.create(createUomInput)
  }

  @Query(() => [Uom], { name: 'uoms' })
  async findAll() {
    return await this.uomsService.findAll()
  }

  @Query(() => Uom, { name: 'uom' })
  findOne(@Args('id') id: string) {
    return this.uomsService.findOne(id)
  }

  @Query(() => [Uom], { name: 'companyUoms' })
  findByCompany(@Args('companyId') companyId: string) {
    return this.uomsService.findByCompanyId(companyId)
  }

  @Mutation(() => Uom)
  updateUom(@Args('updateUomInput') updateUomInput: UpdateUomInput) {
    return this.uomsService.update(updateUomInput.id, updateUomInput)
  }

  @Mutation(() => Uom)
  removeUom(@Args('id') id: string) {
    return this.uomsService.remove(id)
  }

  @ResolveField('company', () => Company, { nullable: true })
  getCompany(@Parent() uom: Uom) {
    const { companyId } = uom
    return this.companiesService.findOne(companyId)
  }
}
