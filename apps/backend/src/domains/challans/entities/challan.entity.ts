import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Challan {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
