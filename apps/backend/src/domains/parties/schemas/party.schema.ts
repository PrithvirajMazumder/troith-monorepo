import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Company } from '@/domains/companies/schemas/company.schema'
import { Document, Types } from 'mongoose'
import { Item } from '@/domains/items/schemas/item.schema'

export type PartyDocument = Party & Document

@Schema()
export class Party {
  @Prop({ required: true })
  name: string

  @Prop({ required: true })
  addressLine1: string

  @Prop({ required: false })
  addressLine2?: string

  @Prop({ required: true })
  state: string

  @Prop({ required: true })
  city: string

  @Prop({ required: true })
  zipCode: number

  @Prop({ required: true, type: Types.ObjectId, ref: Company.name })
  companyId: string

  @Prop({ required: true })
  gstin: string

  @Prop({ required: false, type: Types.ObjectId, ref: Item.name })
  partyItemIds?: Array<string>
}

export const PartySchema = SchemaFactory.createForClass(Party)
