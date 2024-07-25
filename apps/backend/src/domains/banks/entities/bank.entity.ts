import { Field, Int, ObjectType } from '@nestjs/graphql'
import { Bank as BankSchema } from '@/domains/banks/schemas/bank.schema'
import { User } from '@/domains/users/entities/user.entity'

@ObjectType()
export class Bank extends BankSchema {
  @Field({ nullable: false, name: 'id' })
  _id: string

  @Field(() => Int, { nullable: false })
  accountNumber: number

  @Field({ nullable: false })
  branch: string

  @Field({ nullable: false })
  name: string

  @Field({ nullable: false })
  ifsc: string

  @Field(() => User, {nullable: true})
  user?: User
}
