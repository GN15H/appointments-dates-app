import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceInput } from './dto/create-service.input';
import { CognitoHttpGuard } from 'src/auth/cognito.http.guard';

@UseGuards(CognitoHttpGuard)
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) { }

  @Post()
  create(@Body() createServiceDto: CreateServiceInput) {
    return this.servicesService.create(createServiceDto);
  }

  @Get()
  findAll() {
    return this.servicesService.findAll();
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
