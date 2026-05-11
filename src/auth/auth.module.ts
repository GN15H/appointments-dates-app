import { Module } from '@nestjs/common';
import { CognitoGqlGuard } from './cognito.guard';
import { CognitoHttpGuard } from './cognito.http.guard';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  providers: [CognitoGqlGuard, CognitoHttpGuard],
  exports: [CognitoGqlGuard, CognitoHttpGuard],
  imports: [JwtModule.register({
    global: true,
    // secret: jwtConstants.secret,
    signOptions: { expiresIn: '60s' },
  }),]
})
export class AuthModule { }
