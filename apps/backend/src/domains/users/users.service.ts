import { Injectable } from '@nestjs/common'
import { CreateUserInput } from '@/domains/users/dto/create-user.input'
import { UpdateUserInput } from '@/domains/users/dto/update-user.input'
import { UsersRepository } from '@/domains/users/users.repository'
import { Types } from 'mongoose'

@Injectable()
export class UsersService {
  public constructor(private readonly usersRepository: UsersRepository) {}

  public create(createUserInput: CreateUserInput) {
    return this.usersRepository.save(createUserInput)
  }

  public findAll() {
    return this.usersRepository.find({})
  }

  public findOne(id: string) {
    const userId = new Types.ObjectId(id)
    return this.usersRepository.findOne({ _id: userId })
  }

  public update(id: string, updateUserInput: UpdateUserInput) {
    const userId = new Types.ObjectId(id)
    return this.usersRepository.findOneAndUpdate({ _id: userId }, updateUserInput)
  }

  public remove(id: string) {
    const userId = new Types.ObjectId(id)
    return this.usersRepository.findOneAndDelete({ _id: userId })
  }
}
