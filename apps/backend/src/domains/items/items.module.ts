import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ItemsService } from '@/domains/items/items.service'
import { ItemsResolver } from '@/domains/items/items.resolver'
import { ItemsRepository } from '@/domains/items/items.repository'
import { Item, ItemSchema } from '@/domains/items/schemas/item.schema'
import { Uom, UomSchema } from '@/domains/uoms/schemas/uom.schema'
import { Company, CompanySchema } from '@/domains/companies/schemas/company.schema'
import { Tax, TaxSchema } from '@/domains/taxes/schemas/tax.schema'
import { UomsService } from '@/domains/uoms/uoms.service'
import { UomsRepository } from '@/domains/uoms/uoms.repository'
import { CompaniesService } from '@/domains/companies/companies.service'
import { CompaniesRepository } from '@/domains/companies/companies.repository'
import { TaxesService } from '@/domains/taxes/taxes.service'
import { TaxesRepository } from '@/domains/taxes/taxes.repository'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Item.name, schema: ItemSchema },
      { name: Uom.name, schema: UomSchema },
      { name: Company.name, schema: CompanySchema },
      { name: Tax.name, schema: TaxSchema }
    ])
  ],
  providers: [
    ItemsResolver,
    ItemsService,
    ItemsRepository,
    UomsService,
    UomsRepository,
    CompaniesService,
    CompaniesRepository,
    TaxesService,
    TaxesRepository
  ]
})
export class ItemsModule {}
