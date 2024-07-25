import { InputType, Int, Field } from '@nestjs/graphql'

@InputType()
export class CreateTaxInput {
  @Field(() => Int)
  cgst: number

  @Field(() => Int)
  sgst: number
}
