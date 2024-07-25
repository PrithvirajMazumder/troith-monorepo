import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql'
import {
  Invoice as InvoiceSchema,
  InvoiceItem as InvoiceItemSchema
} from '@/domains/invoices/schemas/invoice.schema'
import { Party } from '@/domains/parties/entities/party.entity'
import { Company } from '@/domains/companies/entities/company.entity'
import { Tax } from '@/domains/taxes/entities/tax.entity'
import { Bank } from '@/domains/banks/entities/bank.entity'
import { Item } from '@/domains/items/entities/item.entity'
import { InvoiceStatus } from '@/domains/invoices/constants/allowedInvoiceStatus'

registerEnumType(InvoiceStatus, {
  name: 'InvoiceStatus'
})

@ObjectType()
export class InvoiceItem extends InvoiceItemSchema {
  @Field(() => Int)
  quantity: number

  @Field(() => Item, {nullable: true})
  item?: Item

  @Field(() => Int)
  price: number
}

@ObjectType()
export class Invoice extends InvoiceSchema {
  @Field()
  id: string

  @Field({ nullable: false })
  date: string

  @Field(() => [InvoiceItem])
  invoiceItems: Array<InvoiceItem>

  @Field(() => Party)
  party: Party

  @Field({ nullable: true })
  vehicleNumber?: string

  @Field(() => Company, {
    nullable: true
  })
  company?: Company

  @Field(() => Tax, { nullable: true })
  tax?: Tax

  @Field()
  no: string

  @Field(() => Bank, { nullable: true })
  bank?: Bank

  @Field(() => InvoiceStatus)
  status: InvoiceStatus
}
