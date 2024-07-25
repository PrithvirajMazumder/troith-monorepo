import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { User } from '@/domains/users/schemas/user.schema'
import { Bank } from '@/domains/banks/schemas/bank.schema'

export type CompanyDocument = Company & Document

@Schema()
export class Company {
  @Prop({ required: true })
  name: string

  @Prop({ required: true, unique: true })
  legalName: string

  @Prop({ required: true })
  addressLine1: string

  @Prop({ required: false })
  addressLine2?: string

  @Prop({ required: true })
  zipCode: number

  @Prop({ required: true })
  state: string

  @Prop({ required: true, unique: true })
  gstin: string

  @Prop({ required: true })
  city: string

  @Prop({ required: false })
  totalGrossInvoiceAmount?: number

  @Prop({ required: false })
  totalNetInvoiceAmount?: number

  @Prop({ required: false })
  totalGrossChallanAmount?: number

  @Prop({ required: false })
  totalNetChallanAmount?: number

  @Prop({ type: Types.ObjectId, required: true, ref: User.name })
  userId: string

  @Prop({ type: Types.ObjectId, required: true, ref: Bank.name })
  bankId: string
}

export const CompanySchema = SchemaFactory.createForClass(Company)
