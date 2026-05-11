import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CognitoGqlGuard } from '../auth/cognito.guard';
import { BookingsService } from './bookings.service';
import { Booking } from './entities/booking.entity';
import { CreateBookingInput } from './dto/create-booking.input';
import { CurrentUser } from '../users/users.resolver';

@Resolver(() => Booking)
@UseGuards(CognitoGqlGuard)
export class BookingsResolver {
  constructor(private bookingsService: BookingsService) { }

  @Query(() => [Booking])
  async myBookings(@CurrentUser() user: any): Promise<Booking[]> {
    return this.bookingsService.findByUser(user.sub);
  }

  @Mutation(() => Booking)
  async createBooking(
    @CurrentUser() user: any,
    @Args('input') input: CreateBookingInput,
  ): Promise<Booking> {
    return this.bookingsService.create(user.sub, input);
  }

  @Mutation(() => Booking)
  async cancelBooking(
    @CurrentUser() user: any,
    @Args('bookingId') bookingId: string,
    @Args('date') date: string,
    @Args('timeSlot') timeSlot: string,
  ): Promise<Booking> {
    return this.bookingsService.cancel(user.sub, bookingId, date, timeSlot);
  }
}
