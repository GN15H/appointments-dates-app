import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CancelBookingDto {
  @Field()
  bookingId: string;

  @Field()
  date: string;

  @Field()
  timeSlot: string;
}
