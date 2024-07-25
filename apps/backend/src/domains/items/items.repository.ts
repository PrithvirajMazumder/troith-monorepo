import { Injectable } from '@nestjs/common'
import { EntityRepository } from '@/db/entity.repository'
import { Item, ItemDocument } from '@/domains/items/schemas/item.schema'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

@Injectable()
export class ItemsRepository extends EntityRepository<ItemDocument> {
  constructor(@InjectModel(Item.name) itemModel: Model<ItemDocument>) {
    super(itemModel)
  }
}
