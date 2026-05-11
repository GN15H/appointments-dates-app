import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CognitoHttpGuard } from 'src/auth/cognito.http.guard';
import { BookingsService } from './bookings.service';
import { CreateBookingInput } from './dto/create-booking.input';
import { CreateBookingDto } from './dto/create-booking.dto';

@UseGuards(CognitoHttpGuard)
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) { }

  @Post()
  create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.create(createBookingDto.userId, createBookingDto);
  }

  @Get(':id')
  findAll(@Param('id') id: string) {
    console.log('wet');
    return this.bookingsService.findByUser(id);
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
