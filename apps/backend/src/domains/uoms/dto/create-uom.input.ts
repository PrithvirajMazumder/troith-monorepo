import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class CreateUomInput {
  @Field()
  abbreviation: string

  @Field()
  name: string

  @Field()
  companyId: string
}
