import { Module } from '@nestjs/common'
import { BanksService } from '@/domains/banks/banks.service'
import { BanksResolver } from '@/domains/banks/banks.resolver'
import { MongooseModule } from '@nestjs/mongoose'
import { Bank, BankSchema } from '@/domains/banks/schemas/bank.schema'
import { BanksRepository } from '@/domains/banks/banks.repository'
import { UsersService } from '@/domains/users/users.service'
import { UsersRepository } from '@/domains/users/users.repository'
import { User, UserSchema } from '@/domains/users/schemas/user.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Bank.name, schema: BankSchema },
      {
        name: User.name,
        schema: UserSchema
      }
    ])
  ],
  providers: [BanksResolver, BanksService, BanksRepository, UsersService, UsersRepository]
})
export class BanksModule {}
