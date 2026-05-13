import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { CognitoHttpGuard } from 'src/auth/cognito.http.guard';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/user.dto';
import { CognitoJwtVerifier } from 'aws-jwt-verify';

export const CurrentRESTUser = createParamDecorator(
  (data: keyof any, ctx: ExecutionContext) => {

    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);

@UseGuards(CognitoHttpGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.usersService.create(createUserDto);
  // }

  // @Get()
  // findAll() {
  //   return this.usersService.findAll();
  // }

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
