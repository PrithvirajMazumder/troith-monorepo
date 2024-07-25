import { Injectable } from '@nestjs/common'
import { EntityRepository } from '@/db/entity.repository'
import { Party, PartyDocument } from '@/domains/parties/schemas/party.schema'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

@Injectable()
export class PartiesRepository extends EntityRepository<PartyDocument> {
  constructor(@InjectModel(Party.name) partyModel: Model<PartyDocument>) {
    super(partyModel)
  }
}
