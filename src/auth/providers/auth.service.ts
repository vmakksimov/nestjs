import { Injectable, forwardRef, Inject, BadRequestException } from '@nestjs/common';
import { SignInDto } from '../dtos/signin.dto';
import { SignInProvider } from './sign-in-provider';

@Injectable()
export class AuthService {
  constructor(
    private readonly signInProvider: SignInProvider
) {}
  public signIn(signInDto: SignInDto) {
    const token = this.isAuth(signInDto);
    
    return token;
    
  }

  public async isAuth(signInDto: SignInDto) {
    return this.signInProvider.signIn(signInDto);
  }


}
