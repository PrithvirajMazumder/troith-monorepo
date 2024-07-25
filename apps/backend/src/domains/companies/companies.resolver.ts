import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { CompaniesService } from './companies.service'
import { Company } from './entities/company.entity'
import { CreateCompanyInput } from './dto/create-company.input'
import { UpdateCompanyInput } from './dto/update-company.input'
import { User } from '@/domains/users/entities/user.entity'
import { UsersService } from '@/domains/users/users.service'
import { BanksService } from '@/domains/banks/banks.service'
import { Bank } from '@/domains/banks/entities/bank.entity'

@Resolver(() => Company)
export class CompaniesResolver {
  constructor(
    private readonly companiesService: CompaniesService,
    private readonly usersService: UsersService,
    private readonly banksService: BanksService
  ) {}

  @Mutation(() => Company)
  createCompany(@Args('createCompanyInput') createCompanyInput: CreateCompanyInput) {
    return this.companiesService.create(createCompanyInput)
  }

  @Query(() => [Company], { name: 'companies' })
  async findAll(@Args('userId') userId: string) {
    return await this.companiesService.findAllByUserId(userId)
  }

  @Query(() => Company, { name: 'company' })
  findOne(@Args('id') id: string) {
    return this.companiesService.findOne(id)
  }

  @Mutation(() => Company)
  updateCompany(@Args('updateCompanyInput') updateCompanyInput: UpdateCompanyInput) {
    return this.companiesService.update(updateCompanyInput.id, updateCompanyInput)
  }

  @Mutation(() => Company)
  removeCompany(@Args('id') id: string) {
    return this.companiesService.remove(id)
  }

  @ResolveField('user', () => User)
  getUser(@Parent() company: Company) {
    const { userId } = company
    return this.usersService.findOne(userId)
  }

  @ResolveField('bank', () => Bank)
  getBank(@Parent() company: Company) {
    const { bankId } = company
    return this.banksService.findOne(bankId)
  }
}
