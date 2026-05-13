import { Controller, Get, Post, Body, Patch, UseGuards } from '@nestjs/common';
import { CognitoHttpGuard } from 'src/auth/cognito.http.guard';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { CurrentRESTUser } from 'src/users/users.controller';
import { CancelBookingDto } from './dto/cancel-booking.dto';

@UseGuards(CognitoHttpGuard)
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) { }

  @Post()
  create(@CurrentRESTUser() user: any, @Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.create(user.sub, createBookingDto);
  }

  @Get()
  findAll(@CurrentRESTUser() user: any) {
    console.log('huh?', user);
    return this.bookingsService.findByUser(user.sub);
  }

  @Patch()
  cancel(@CurrentRESTUser() user: any, @Body() cancelBookingDto: CancelBookingDto) {
    return this.bookingsService.cancel(user.sub, cancelBookingDto.bookingId, cancelBookingDto.date, cancelBookingDto.timeSlot);
  }

}
