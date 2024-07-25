import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { Uom } from '@/domains/uoms/schemas/uom.schema'
import { Company } from '@/domains/companies/schemas/company.schema'
import { Tax } from '@/domains/taxes/schemas/tax.schema'

export type ItemDocument = Item & Document

@Schema()
export class Item {
  @Prop({ required: true })
  name: string

  @Prop({ required: true })
  hsn: number

  @Prop({ type: Types.ObjectId, required: true, ref: Uom.name })
  uomId: string

  @Prop({ type: Types.ObjectId, required: true, ref: Company.name })
  companyId: string

  @Prop({ type: Types.ObjectId, required: true, ref: Tax.name })
  taxId: string
}

export const ItemSchema = SchemaFactory.createForClass(Item)
