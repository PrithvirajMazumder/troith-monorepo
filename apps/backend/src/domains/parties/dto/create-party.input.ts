import { Field, InputType, Int } from '@nestjs/graphql'

@InputType()
export class CreatePartyInput {
  @Field()
  addressLine1: string

  @Field({ nullable: true })
  addressLine2?: string

  @Field(() => Int)
  zipCode: number

  @Field()
  name: string

  @Field()
  state: string

  @Field()
  gstin: string

  @Field()
  city: string

  @Field(() => [String])
  partyItemIds: Array<string>

  @Field()
  companyId: string
}
