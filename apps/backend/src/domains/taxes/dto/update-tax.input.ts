import { CreateTaxInput } from './create-tax.input'
import { Field, InputType, PartialType } from '@nestjs/graphql'

@InputType()
export class UpdateTaxInput extends PartialType(CreateTaxInput) {
  @Field()
  id: string
}
