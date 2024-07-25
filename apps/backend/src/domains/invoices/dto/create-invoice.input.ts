import { Field, InputType, Int } from '@nestjs/graphql'
import { IsDateString, IsNotEmpty } from 'class-validator'

@InputType()
export class CreateInvoiceItemInput {
  @Field(() => Int)
  quantity: number

  @Field()
  itemId: string

  @Field(() => Int)
  price: number
}

@InputType()
export class CreateInvoiceInput {
  @Field(() => [CreateInvoiceItemInput])
  invoiceItems: Array<CreateInvoiceItemInput>

  @Field()
  partyId: string

  @Field()
  vehicleNumber: string

  @IsNotEmpty()
  @IsDateString()
  @Field({ nullable: false })
  date: string

  @Field()
  companyId: string

  @Field()
  taxId: string

  @Field()
  no: string

  @Field()
  bankId: string
}
