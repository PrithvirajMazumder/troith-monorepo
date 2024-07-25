import { Injectable } from '@nestjs/common'
import { CreatePartyInput } from './dto/create-party.input'
import { UpdatePartyInput } from './dto/update-party.input'
import { PartiesRepository } from '@/domains/parties/parties.repository'
import { Types } from 'mongoose'

@Injectable()
export class PartiesService {
  constructor(private readonly partiesRepository: PartiesRepository) {}

  create(createPartyInput: CreatePartyInput) {
    return this.partiesRepository.save(createPartyInput)
  }

  findAllByCompanyId(companyId: string) {
    return this.partiesRepository.find({ companyId })
  }

  findOne(id: string) {
    const partyId = new Types.ObjectId(id)
    return this.partiesRepository.findOne({ _id: partyId })
  }

  update(id: string, updatePartyInput: UpdatePartyInput) {
    const partyId = new Types.ObjectId(id)
    return this.partiesRepository.findOneAndUpdate(partyId, updatePartyInput)
  }

  remove(id: string) {
    const partyId = new Types.ObjectId(id)
    return this.partiesRepository.findOneAndDelete(partyId)
  }
}
