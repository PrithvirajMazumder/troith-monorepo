import { CreateCompanyInput } from '@/domains/companies/dto/create-company.input'
import { Field, InputType, Int, PartialType } from '@nestjs/graphql'

@InputType()
export class UpdateCompanyInput extends PartialType(CreateCompanyInput) {
  @Field()
  id: string

  @Field(() => Int, { nullable: true })
  totalGrossInvoiceAmount: number

  @Field(() => Int, { nullable: true })
  totalNetChallanAmount: number

  @Field(() => Int, { nullable: true })
  totalGrossChallanAmount: number

  @Field(() => Int, { nullable: true })
  totalNetInvoiceAmount: number
}
