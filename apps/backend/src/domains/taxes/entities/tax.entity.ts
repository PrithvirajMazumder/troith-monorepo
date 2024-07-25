import { ObjectType, Field, Int } from '@nestjs/graphql'
import { Tax as TaxSchema } from '@/domains/taxes/schemas/tax.schema'

@ObjectType()
export class Tax extends TaxSchema {
  @Field({ nullable: true })
  id?: string

  @Field(() => Int)
  cgst: number

  @Field(() => Int)
  sgst: number
}
