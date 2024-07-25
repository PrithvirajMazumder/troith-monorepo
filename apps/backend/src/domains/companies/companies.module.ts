import { Module } from '@nestjs/common'
import { CompaniesService } from './companies.service'
import { CompaniesResolver } from './companies.resolver'
import { MongooseModule } from '@nestjs/mongoose'
import { Company, CompanySchema } from '@/domains/companies/schemas/company.schema'
import { CompaniesRepository } from '@/domains/companies/companies.repository'
import { User, UserSchema } from '@/domains/users/schemas/user.schema'
import { Bank, BankSchema } from '@/domains/banks/schemas/bank.schema'
import { BanksService } from '@/domains/banks/banks.service'
import { BanksRepository } from '@/domains/banks/banks.repository'
import { UsersService } from '@/domains/users/users.service'
import { UsersRepository } from '@/domains/users/users.repository'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Company.name, schema: CompanySchema },
      { name: Bank.name, schema: BankSchema },
      {
        name: User.name,
        schema: UserSchema
      }
    ])
  ],
  providers: [
    CompaniesResolver,
    CompaniesService,
    CompaniesRepository,
    BanksService,
    BanksRepository,
    UsersService,
    UsersRepository
  ]
})
export class CompaniesModule {}
