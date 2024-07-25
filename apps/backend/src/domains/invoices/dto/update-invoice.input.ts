import { CreateInvoiceInput, CreateInvoiceItemInput } from './create-invoice.input'
import { Field, InputType, OmitType, PartialType } from '@nestjs/graphql'
import { InvoiceStatus } from '@/domains/invoices/constants/allowedInvoiceStatus'

@InputType()
export class UpdateInvoiceItemInput extends OmitType(CreateInvoiceItemInput, ['itemId']) {}

@InputType()
export class UpdateInvoiceInput extends OmitType(PartialType(CreateInvoiceInput), ['companyId']) {
  @Field()
  id: string

  @Field(() => InvoiceStatus, {
    nullable: true
  })
  status?: InvoiceStatus
}
