import { Injectable } from '@nestjs/common'
import { CreateUomInput } from './dto/create-uom.input'
import { UpdateUomInput } from './dto/update-uom.input'
import { UomsRepository } from '@/domains/uoms/uoms.repository'
import { Types } from 'mongoose'

@Injectable()
export class UomsService {
  public constructor(private readonly uomsRepository: UomsRepository) {}

  async create(createUomInput: CreateUomInput) {
    const { companyId, name } = createUomInput
    const duplicateUoms = await this.uomsRepository.find({ companyId, name })

    if (!duplicateUoms.length) {
      return this.uomsRepository.save(createUomInput)
    }

    throw new Error(`${name} uom is already present`)
  }

  findAll() {
    return this.uomsRepository.find({})
  }

  findOne(id: string) {
    const uomId = new Types.ObjectId(id)
    return this.uomsRepository.findOne({ _id: uomId })
  }

  update(id: string, updateUomInput: UpdateUomInput) {
    const uomId = new Types.ObjectId(id)
    return this.uomsRepository.findOneAndUpdate(uomId, updateUomInput)
  }

  findByCompanyId(companyId: string) {
    return this.uomsRepository.find({ companyId })
  }

  remove(id: string) {
    const uomId = new Types.ObjectId(id)
    return this.uomsRepository.findOneAndDelete(uomId)
  }
}
