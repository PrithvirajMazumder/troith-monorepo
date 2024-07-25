import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { User } from '@/domains/users/schemas/user.schema'
import { Document, Types } from 'mongoose'

export type BankDocument = Bank & Document

@Schema()
export class Bank {
  @Prop({ required: true, unique: true })
  accountNumber: number

  @Prop({ required: true })
  name: string

  @Prop({ required: true })
  ifsc: string

  @Prop({ required: true })
  branch: string

  @Prop({ type: Types.ObjectId, required: true, ref: User.name })
  userId: string
}

export const BankSchema = SchemaFactory.createForClass(Bank)
