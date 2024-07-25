import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class CreateItemInput {
  @Field()
  name: string

  @Field({ nullable: true })
  hsn: number

  @Field()
  companyId: string

  @Field()
  taxId: string

  @Field()
  uomId: string
}
