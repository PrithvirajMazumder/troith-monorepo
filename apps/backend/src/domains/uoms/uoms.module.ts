import { Module } from '@nestjs/common'
import { UomsService } from '@/domains/uoms/uoms.service'
import { UomsResolver } from '@/domains/uoms/uoms.resolver'
import { MongooseModule } from '@nestjs/mongoose'
import { Uom, UomSchema } from '@/domains/uoms/schemas/uom.schema'
import { Company } from '@/domains/companies/schemas/company.schema'
import { UomsRepository } from '@/domains/uoms/uoms.repository'
import { CompaniesService } from '@/domains/companies/companies.service'
import { CompaniesRepository } from '@/domains/companies/companies.repository'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Uom.name, schema: UomSchema },
      {
        name: Company.name,
        schema: UomSchema
      }
    ])
  ],
  providers: [UomsResolver, UomsService, UomsRepository, CompaniesService, CompaniesRepository]
})
export class UomsModule {}
