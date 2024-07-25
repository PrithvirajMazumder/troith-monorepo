import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { UsersService } from '@/domains/users/users.service'
import { User } from '@/domains/users/entities/user.entity'
import { CreateUserInput } from '@/domains/users/dto/create-user.input'
import { UpdateUserInput } from '@/domains/users/dto/update-user.input'

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.usersService.create(createUserInput)
  }

  @Query(() => [User], { name: 'users' })
  async findAll() {
    return await this.usersService.findAll()
  }

  @Query(() => User, { name: 'user' })
  findOne(@Args('id', {}) id: string) {
    return this.usersService.findOne(id)
  }

  @Mutation(() => User)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.usersService.update(updateUserInput.id, updateUserInput)
  }

  @Mutation(() => User)
  removeUser(@Args('id') id: string) {
    return this.usersService.remove(id)
  }
}
