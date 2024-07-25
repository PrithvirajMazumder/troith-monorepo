import { CreateChallanInput } from './create-challan.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateChallanInput extends PartialType(CreateChallanInput) {
  @Field(() => Int)
  id: number;
}
