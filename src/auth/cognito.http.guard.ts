import { ConfigService } from '@nestjs/config';
import { CognitoJwtVerifier } from 'aws-jwt-verify';

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class CognitoHttpGuard implements CanActivate {
  private verifier: ReturnType<typeof CognitoJwtVerifier.create>;
  constructor(private readonly jwtService: JwtService, private configService: ConfigService) {
    this.verifier = CognitoJwtVerifier.create({
      userPoolId: this.configService.get<string>('COGNITO_USER_POOL_ID')!,
      clientId: this.configService.get<string>('COGNITO_CLIENT_ID')!,
      tokenUse: 'id',
    });
  }


  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    console.log('ke puta e e eto', request.rawHeaders)
    const token = this.extractTokenFromHeader(request);
    console.log('tan solo el token', token);
    if (!token) {
      throw new UnauthorizedException();
    }
    console.log('mm el token?', token)
    try {
      const payload = await this.verifier.verify(token);
      request.user = payload;
      console.log('tf is this shite?', payload);
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
