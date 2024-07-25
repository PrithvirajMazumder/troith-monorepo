import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ChallansService } from './challans.service';
import { Challan } from './entities/challan.entity';
import { CreateChallanInput } from './dto/create-challan.input';
import { UpdateChallanInput } from './dto/update-challan.input';

@Resolver(() => Challan)
export class ChallansResolver {
  constructor(private readonly challansService: ChallansService) {}

  @Mutation(() => Challan)
  createChallan(@Args('createChallanInput') createChallanInput: CreateChallanInput) {
    return this.challansService.create(createChallanInput);
  }

  @Query(() => [Challan], { name: 'challans' })
  findAll() {
    return this.challansService.findAll();
  }

  @Query(() => Challan, { name: 'challan' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.challansService.findOne(id);
  }

  @Mutation(() => Challan)
  updateChallan(@Args('updateChallanInput') updateChallanInput: UpdateChallanInput) {
    return this.challansService.update(updateChallanInput.id, updateChallanInput);
  }

  @Mutation(() => Challan)
  removeChallan(@Args('id', { type: () => Int }) id: number) {
    return this.challansService.remove(id);
  }
}
