import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { Item } from '@/domains/items/schemas/item.schema'
import { Tax } from '@/domains/taxes/schemas/tax.schema'
import { Bank } from '@/domains/banks/schemas/bank.schema'
import { InvoiceStatusArr } from '@/domains/invoices/constants/allowedInvoiceStatus'

@Schema()
export class InvoiceItem {
  @Prop({ required: true })
  quantity: number

  @Prop({ required: true })
  price: number

  @Prop({ required: true, type: Types.ObjectId, ref: Item.name })
  itemId: string
}

export type InvoiceDocument = Invoice & Document

@Schema()
export class Invoice {
  @Prop({ required: true })
  no: string

  @Prop({ required: true })
  companyId: string

  @Prop({ required: true })
  partyId: string

  @Prop({ required: true, type: [InvoiceItem], ref: InvoiceItem.name })
  invoiceItems: Array<InvoiceItem>

  @Prop({ required: true, type: Types.ObjectId, ref: Tax.name })
  taxId: string

  @Prop({ required: true })
  vehicleNumber?: string

  @Prop({ required: true })
  date: string

  @Prop({ required: true, type: Types.ObjectId, ref: Bank.name })
  bankId: string

  @Prop({
    type: String,
    required: true,
    enum: InvoiceStatusArr
  })
  status: string
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice)
