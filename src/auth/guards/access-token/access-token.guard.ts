import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { Request } from 'express';
import jwtConfig from 'src/auth/config/jwt.config';
import { AUTH_TYPE_KEY, REQUEST_USER_KEY } from 'src/auth/constants/auth.constants';
import { Reflector } from '@nestjs/core';
import { AuthType } from 'src/auth/enums/auth-type.enum';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly reflector: Reflector
  ){

  }
  async canActivate(
    context: ExecutionContext,
  ):  Promise<boolean> {

    const authTypes = this.reflector.get<AuthType[]>(
      AUTH_TYPE_KEY,
      context.getHandler()
    )

      // Allow access if `AuthType.None` is present
      if (authTypes?.includes(AuthType.None)) {
        return true;
      }

    const request = context.switchToHttp().getRequest();
    const token = this.extractRequestFromHeader(request);
    if (!token){
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, this.jwtConfiguration);
      request[REQUEST_USER_KEY] = payload
      console.log("payload", payload)
    } catch (error) {
      throw new UnauthorizedException({
        message: 'Access token not valid',
      })
    }
    return true;
  }

  private extractRequestFromHeader(request: Request) {
    const [_, token] = request.headers.authorization?.split(' ') ?? [];
    return token;
  }
}
