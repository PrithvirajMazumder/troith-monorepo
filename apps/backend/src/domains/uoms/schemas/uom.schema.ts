import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { Company } from '@/domains/companies/schemas/company.schema'

export type UomDocument = Uom & Document

@Schema()
export class Uom {
  @Prop({ required: true })
  name: string

  @Prop({ required: true })
  abbreviation: string

  @Prop({ type: Types.ObjectId, required: true, ref: Company.name })
  companyId: string
}

export const UomSchema = SchemaFactory.createForClass(Uom)
