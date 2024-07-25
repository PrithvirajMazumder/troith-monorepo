import { Module } from '@nestjs/common'
import { InvoicesService } from '@/domains/invoices/invoices.service'
import { InvoicesResolver } from '@/domains/invoices/invoices.resolver'
import { MongooseModule } from '@nestjs/mongoose'
import { Invoice, InvoiceSchema } from '@/domains/invoices/schemas/invoice.schema'
import { Bank, BankSchema } from '@/domains/banks/schemas/bank.schema'
import { Tax, TaxSchema } from '@/domains/taxes/schemas/tax.schema'
import { Company, CompanySchema } from '@/domains/companies/schemas/company.schema'
import { InvoicesRepository } from '@/domains/invoices/invoices.repository'
import { BanksService } from '@/domains/banks/banks.service'
import { BanksRepository } from '@/domains/banks/banks.repository'
import { TaxesService } from '@/domains/taxes/taxes.service'
import { TaxesRepository } from '@/domains/taxes/taxes.repository'
import { CompaniesService } from '@/domains/companies/companies.service'
import { CompaniesRepository } from '@/domains/companies/companies.repository'
import { ItemsService } from '@/domains/items/items.service'
import { ItemsRepository } from '@/domains/items/items.repository'
import { Item, ItemSchema } from '@/domains/items/schemas/item.schema'
import { PartiesService } from '@/domains/parties/parties.service'
import { PartiesRepository } from '@/domains/parties/parties.repository'
import { Party, PartySchema } from '@/domains/parties/schemas/party.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Invoice.name, schema: InvoiceSchema },
      { name: Bank.name, schema: BankSchema },
      { name: Tax.name, schema: TaxSchema },
      { name: Company.name, schema: CompanySchema },
      { name: Item.name, schema: ItemSchema },
      { name: Party.name, schema: PartySchema }
    ])
  ],
  providers: [
    InvoicesResolver,
    InvoicesService,
    InvoicesRepository,
    BanksService,
    BanksRepository,
    TaxesService,
    TaxesRepository,
    CompaniesService,
    CompaniesRepository,
    ItemsService,
    ItemsRepository,
    PartiesService,
    PartiesRepository
  ]
})
export class InvoicesModule {}
