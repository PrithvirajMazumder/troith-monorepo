import { Module } from '@nestjs/common'
import { PartiesService } from '@/domains/parties/parties.service'
import { PartiesResolver } from '@/domains/parties/parties.resolver'
import { MongooseModule } from '@nestjs/mongoose'
import { Party, PartySchema } from '@/domains/parties/schemas/party.schema'
import { Company, CompanySchema } from '@/domains/companies/schemas/company.schema'
import { PartiesRepository } from '@/domains/parties/parties.repository'
import { CompaniesService } from '@/domains/companies/companies.service'
import { CompaniesRepository } from '@/domains/companies/companies.repository'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Party.name, schema: PartySchema },
      { name: Company.name, schema: CompanySchema }
    ])
  ],
  providers: [
    PartiesResolver,
    PartiesService,
    PartiesRepository,
    CompaniesService,
    CompaniesRepository
  ]
})
export class PartiesModule {}
