import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type TaxDocument = Tax & Document

@Schema()
export class Tax {
  @Prop({ required: true })
  sgst: number

  @Prop({ required: true })
  cgst: number
}

export const TaxSchema = SchemaFactory.createForClass(Tax)
