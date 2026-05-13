import { Controller, Get, UseGuards, createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CognitoHttpGuard } from 'src/auth/cognito.http.guard';
import { UsersService } from './users.service';

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

  @Get()
  me(@CurrentRESTUser() cognitoUser: any) {
    return this.usersService.findOrCreate(cognitoUser);
  }
}
