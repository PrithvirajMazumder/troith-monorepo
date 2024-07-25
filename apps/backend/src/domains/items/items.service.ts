import { Injectable } from '@nestjs/common'
import { CreateItemInput } from '@/domains/items/dto/create-item.input'
import { UpdateItemInput } from '@/domains/items/dto/update-item.input'
import { ItemsRepository } from '@/domains/items/items.repository'
import { Types } from 'mongoose'

@Injectable()
export class ItemsService {
  constructor(private readonly itemsRepository: ItemsRepository) {}

  create(createItemInput: CreateItemInput) {
    return this.itemsRepository.save(createItemInput)
  }

  findAllByCompanyId(companyId: string) {
    return this.itemsRepository.find({ companyId })
  }

  findItemsByIds(itemIds: Array<string>) {
    return this.itemsRepository.find({ _id: { $in: itemIds } })
  }

  findOne(id: string) {
    const itemId = new Types.ObjectId(id)
    return this.itemsRepository.findOne({ _id: itemId })
  }

  update(id: string, updateItemInput: UpdateItemInput) {
    const itemId = new Types.ObjectId(id)
    return this.itemsRepository.findOneAndUpdate(itemId, updateItemInput)
  }

  remove(id: string) {
    const itemId = new Types.ObjectId(id)
    return this.itemsRepository.findOneAndDelete(itemId)
  }
}
