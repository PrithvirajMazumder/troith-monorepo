import { ObjectType, Field, Int, PartialType } from '@nestjs/graphql'
import { Party as PartySchema } from '@/domains/parties/schemas/party.schema'
import { Company } from '@/domains/companies/entities/company.entity'

@ObjectType()
export class Party extends PartySchema {
  @Field({nullable: true})
  id: string

  @Field({nullable: true})
  addressLine1: string

  @Field({ nullable: true })
  addressLine2: string

  @Field(() => Int, {nullable: true})
  zipCode: number

  @Field({nullable: true})
  name: string

  @Field({nullable: true})
  state: string

  @Field({nullable: true})
  gstin: string

  @Field({nullable: true})
  city: string

  @Field(() => [String], {nullable: true})
  partyItemIds: Array<string>

  @Field(() => Company, { nullable: true })
  company: Company
}
