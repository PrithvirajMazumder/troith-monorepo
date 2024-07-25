import { InputType, Int, Field } from '@nestjs/graphql'

@InputType()
export class CreateUserInput {
  @Field({ nullable: true })
  email: string

  @Field({ nullable: true })
  name: string

  @Field(() => Int, { nullable: true })
  phone: number
}
