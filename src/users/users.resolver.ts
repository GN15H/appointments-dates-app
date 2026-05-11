import { Resolver, Query } from '@nestjs/graphql';
import { UseGuards, Req } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CognitoGqlGuard } from '../auth/cognito.guard';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const gqlCtx = GqlExecutionContext.create(ctx);
    return gqlCtx.getContext().req.user;
  },
);

@Resolver(() => User)
@UseGuards(CognitoGqlGuard)
export class UsersResolver {
  constructor(private usersService: UsersService) { }

  @Query(() => User)
  async me(@CurrentUser() cognitoUser: any): Promise<User> {
    return this.usersService.findOrCreate(cognitoUser);
  }
}
