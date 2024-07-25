import { Field, InputType, Int } from '@nestjs/graphql'

@InputType()
export class CreateBankInput {
  @Field(() => Int, { nullable: false })
  accountNumber: number

  @Field({ nullable: false })
  branch: string

  @Field({ nullable: false })
  name: string

  @Field({ nullable: false })
  ifsc: string

  @Field({ nullable: false })
  userId: string
}
