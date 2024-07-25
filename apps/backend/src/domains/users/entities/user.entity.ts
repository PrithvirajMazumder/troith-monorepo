import { ObjectType, Field, Int } from '@nestjs/graphql'
import { User as UserSchema } from '@/domains/users/schemas/user.schema'

@ObjectType()
export class User extends UserSchema {
  @Field({name: 'id'})
  _id: string;

  @Field({nullable: true})
  email: string

  @Field({nullable: true})
  name: string

  @Field(() => Int, {nullable: true})
  phone: number
}
