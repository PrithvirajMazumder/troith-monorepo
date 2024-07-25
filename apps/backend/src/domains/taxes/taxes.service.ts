import { Injectable } from '@nestjs/common'
import { CreateTaxInput } from './dto/create-tax.input'
import { UpdateTaxInput } from './dto/update-tax.input'
import { TaxesRepository } from '@/domains/taxes/taxes.repository'
import { Types } from 'mongoose'

@Injectable()
export class TaxesService {
  public constructor(private readonly taxesRepository: TaxesRepository) {}

  create(createTaxInput: CreateTaxInput) {
    return this.taxesRepository.save(createTaxInput)
  }

  findAll() {
    return this.taxesRepository.find({})
  }

  findOne(id: string) {
    const taxId = new Types.ObjectId(id)
    return this.taxesRepository.findOne({ _id: taxId })
  }

  update(id: string, updateTaxInput: UpdateTaxInput) {
    const taxId = new Types.ObjectId(id)
    return this.taxesRepository.findOneAndUpdate(taxId, updateTaxInput)
  }

  remove(id: string) {
    const taxId = new Types.ObjectId(id)
    return this.taxesRepository.findOneAndDelete(taxId)
  }
}
