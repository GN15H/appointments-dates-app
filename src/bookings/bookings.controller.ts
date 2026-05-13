import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CognitoHttpGuard } from 'src/auth/cognito.http.guard';
import { BookingsService } from './bookings.service';
import { CreateBookingInput } from './dto/create-booking.input';
import { CreateBookingDto } from './dto/create-booking.dto';
import { CurrentUser } from 'src/users/users.resolver';
import { CurrentRESTUser } from 'src/users/users.controller';

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
    return this.bookingsService.findByUser(user.sub);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.vehiclesService.findOne(+id);
  // }
  //
  // @Get('user/:id')
  // findByUser(@Param('id') id: string) {
  //   return this.vehiclesService.findByUser(+id);
  // }
  //
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateVehicleDto: UpdateVehicleDto) {
  //   return this.vehiclesService.update(+id, updateVehicleDto);
  // }
  //
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.vehiclesService.remove(+id);
  // }
}
