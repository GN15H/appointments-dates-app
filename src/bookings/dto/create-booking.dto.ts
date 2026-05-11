import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateBookingDto {
  @Field()
  userId: string;

  @Field()
  serviceId: string;

  @Field()
  date: string;

  @Field()
  timeSlot: string;
}
