import { Injectable } from '@nestjs/common'
import { EntityRepository } from '@/db/entity.repository'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Uom, UomDocument } from '@/domains/uoms/schemas/uom.schema'

@Injectable()
export class UomsRepository extends EntityRepository<UomDocument> {
  constructor(@InjectModel(Uom.name) uomModel: Model<UomDocument>) {
    super(uomModel)
  }
}
