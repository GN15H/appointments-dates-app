import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Booking {
  @Field()
  id: string;

  @Field()
  userId: string;

  @Field()
  serviceId: string;

  @Field()
  date: string;

  @Field()
  timeSlot: string;

  @Field()
  status: string;

  @Field()
  createdAt: string;
}
