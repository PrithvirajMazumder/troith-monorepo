import { Args, Int, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { BanksService } from '@/domains/banks/banks.service'
import { Bank } from '@/domains/banks/entities/bank.entity'
import { CreateBankInput } from '@/domains/banks/dto/create-bank.input'
import { UpdateBankInput } from '@/domains/banks/dto/update-bank.input'
import { User } from '@/domains/users/entities/user.entity'
import { UsersService } from '@/domains/users/users.service'

@Resolver(() => Bank)
export class BanksResolver {
  constructor(
    private readonly banksService: BanksService,
    private readonly usersService: UsersService
  ) {}

  @Mutation(() => Bank)
  createBank(@Args('createBankInput') createBankInput: CreateBankInput) {
    return this.banksService.create(createBankInput)
  }

  @Query(() => [Bank], { name: 'banks' })
  async findAll() {
    return await this.banksService.findAll()
  }

  @Query(() => Bank, { name: 'bank' })
  async findOne(@Args('id') id: string) {
    return await this.banksService.findOne(id)
  }

  @Mutation(() => Bank)
  updateBank(@Args('updateBankInput') updateBankInput: UpdateBankInput) {
    return this.banksService.update(updateBankInput.id, updateBankInput)
  }

  @Mutation(() => Bank)
  removeBank(@Args('id', { type: () => Int }) id: number) {
    return this.banksService.remove(id)
  }

  @ResolveField('user', () => User, { nullable: true })
  getUser(@Parent() bank: Bank) {
    const { userId } = bank
    return this.usersService.findOne(userId)
  }
}
