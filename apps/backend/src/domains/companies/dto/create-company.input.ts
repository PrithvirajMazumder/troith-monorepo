import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class CreateCompanyInput {
  @Field()
  name: string

  @Field()
  legalName: string

  @Field()
  city: string

  @Field()
  state: string

  @Field()
  addressLine1: string

  @Field({ nullable: true })
  addressLine2: string

  @Field()
  zipCode: number

  @Field()
  gstin: string

  @Field()
  userId: string

  @Field()
  bankId: string
}
