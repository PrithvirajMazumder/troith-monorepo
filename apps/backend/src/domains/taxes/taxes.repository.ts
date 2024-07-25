import { Injectable } from '@nestjs/common'
import { EntityRepository } from '@/db/entity.repository'
import { Tax, TaxDocument } from '@/domains/taxes/schemas/tax.schema'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

@Injectable()
export class TaxesRepository extends EntityRepository<TaxDocument> {
  public constructor(@InjectModel(Tax.name) taxModel: Model<TaxDocument>) {
    super(taxModel)
  }
}
