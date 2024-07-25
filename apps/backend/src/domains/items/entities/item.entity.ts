import { Field, Int, ObjectType } from '@nestjs/graphql'
import { Item as ItemSchema } from '@/domains/items/schemas/item.schema'
import { Company } from '@/domains/companies/entities/company.entity'
import { Tax } from '@/domains/taxes/entities/tax.entity'
import { Uom } from '@/domains/uoms/entities/uom.entity'

@ObjectType()
export class Item extends ItemSchema {
  @Field()
  id: string

  @Field()
  name: string

  @Field(() => Int, { nullable: true })
  hsn: number

  @Field(() => Company, {nullable: true})
  company?: Company

  @Field(() => Tax)
  tax: Tax

  @Field(() => Uom)
  uom: Uom
}
