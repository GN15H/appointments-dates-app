import { InputType, Field, Float, Int } from '@nestjs/graphql';

@InputType()
export class CreateServiceInput {
  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => Float)
  price: number;

  @Field(() => Int)
  durationMinutes: number;
}
