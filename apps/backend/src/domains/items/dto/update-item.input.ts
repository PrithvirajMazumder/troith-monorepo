import { CreateItemInput } from '@/domains/items/dto/create-item.input'
import { Field, InputType, OmitType, PartialType } from '@nestjs/graphql'

@InputType()
export class UpdateItemInput extends OmitType(PartialType(CreateItemInput), ['companyId']) {
  @Field()
  id: string
}
