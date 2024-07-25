import { CreatePartyInput } from './create-party.input'
import { Field, InputType, OmitType, PartialType } from '@nestjs/graphql'

@InputType()
export class UpdatePartyInput extends OmitType(PartialType(CreatePartyInput), ['companyId']) {
  @Field()
  id: string
}
