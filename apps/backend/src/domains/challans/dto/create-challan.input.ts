import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateChallanInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
