import { Document, FilterQuery, Model, UpdateQuery } from 'mongoose'

export abstract class EntityRepository<T extends Document> {
  protected constructor(protected readonly entityModel: Model<T>) {}

  async findOne(entityFilterQuery: FilterQuery<T>): Promise<T | null> {
    return this.entityModel.findOne(entityFilterQuery, { __v: 0 }).exec()
  }

  async find(entityFilterQuery: FilterQuery<T>): Promise<T[] | null> {
    return this.entityModel.find(entityFilterQuery, { __v: 0 }).exec()
  }

  async save(createEntityData: unknown): Promise<T> {
    const entity = new this.entityModel(createEntityData)
    return (await entity.save()) as T
  }

  async findOneAndUpdate(
    entityFilterQuery: FilterQuery<T>,
    updateEntityData: UpdateQuery<unknown>
  ): Promise<T | null> {
    return this.entityModel.findOneAndUpdate(entityFilterQuery, updateEntityData, {
      new: true
    })
  }

  async findOneAndDelete(entityFilterQuery: FilterQuery<T>): Promise<boolean> {
    const deleteResult = await this.entityModel.deleteMany(entityFilterQuery)
    return deleteResult.deletedCount >= 1
  }
}
