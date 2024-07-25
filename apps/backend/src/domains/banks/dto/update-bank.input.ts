import { CreateBankInput } from './create-bank.input'
import { Field, InputType, PartialType } from '@nestjs/graphql'

@InputType()
export class UpdateBankInput extends PartialType(CreateBankInput) {
  @Field()
  id: string
}
