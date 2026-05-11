import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateBookingInput {
  @Field()
  serviceId: string;

  @Field()
  date: string;

  @Field()
  timeSlot: string;
}
