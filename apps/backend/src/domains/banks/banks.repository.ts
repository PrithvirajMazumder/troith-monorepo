import { Injectable } from '@nestjs/common'
import { EntityRepository } from '@/db/entity.repository'
import { Bank, BankDocument } from '@/domains/banks/schemas/bank.schema'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

@Injectable()
export class BanksRepository extends EntityRepository<BankDocument> {
  public constructor(@InjectModel(Bank.name) bankModel: Model<BankDocument>) {
    super(bankModel)
  }
}
