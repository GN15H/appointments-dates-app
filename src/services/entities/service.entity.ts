import { ObjectType, Field, Float, Int } from '@nestjs/graphql';

@ObjectType()
export class Service {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => Float)
  price: number;

  @Field(() => Int)
  durationMinutes: number;

  @Field()
  createdAt: string;
}
