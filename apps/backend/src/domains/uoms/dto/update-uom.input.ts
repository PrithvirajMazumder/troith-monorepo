import { CreateUomInput } from './create-uom.input'
import { Field, InputType, PartialType } from '@nestjs/graphql'

@InputType()
export class UpdateUomInput extends PartialType(CreateUomInput) {
  @Field()
  id: string
}
