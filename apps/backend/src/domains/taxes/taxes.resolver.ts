import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { TaxesService } from '@/domains/taxes/taxes.service'
import { Tax } from '@/domains/taxes/entities/tax.entity'
import { CreateTaxInput } from '@/domains/taxes/dto/create-tax.input'
import { UpdateTaxInput } from '@/domains/taxes/dto/update-tax.input'

@Resolver(() => Tax)
export class TaxesResolver {
  constructor(private readonly taxesService: TaxesService) {}

  @Mutation(() => Tax)
  createTax(@Args('createTaxInput') createTaxInput: CreateTaxInput) {
    return this.taxesService.create(createTaxInput)
  }

  @Query(() => [Tax], { name: 'taxes' })
  findAll() {
    return this.taxesService.findAll()
  }

  @Query(() => Tax, { name: 'tax' })
  findOne(@Args('id') id: string) {
    return this.taxesService.findOne(id)
  }

  @Mutation(() => Tax)
  updateTax(@Args('updateTaxInput') updateTaxInput: UpdateTaxInput) {
    return this.taxesService.update(updateTaxInput.id, updateTaxInput)
  }

  @Mutation(() => Tax)
  removeTax(@Args('id') id: string) {
    return this.taxesService.remove(id)
  }
}
