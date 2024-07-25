import { Field, ObjectType } from '@nestjs/graphql'
import { Uom as UomSchema } from '@/domains/uoms/schemas/uom.schema'
import { Company } from '@/domains/companies/entities/company.entity'

@ObjectType()
export class Uom extends UomSchema {
  @Field({nullable: true})
  id?: string

  @Field()
  abbreviation: string

  @Field()
  name: string

  @Field(() => Company, {nullable: true})
  company?: Company
}
