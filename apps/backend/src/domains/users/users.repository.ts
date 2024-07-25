import { Injectable } from '@nestjs/common'
import { EntityRepository } from '@/db/entity.repository'
import { User, UserDocument } from '@/domains/users/schemas/user.schema'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

@Injectable()
export class UsersRepository extends EntityRepository<UserDocument> {
  public constructor(@InjectModel(User.name) userModel: Model<UserDocument>) {
    super(userModel)
  }
}
