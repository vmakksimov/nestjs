import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { HashingProvider } from './hashing.provider';
import { SignInDto } from '../dtos/signin.dto';
import { UsersService } from 'src/users/providers/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import jwtConfig from '../config/jwt.config';
import { ActiveUserData } from '../interfaces/active-user-data-inteface';
import { GenerateTokensProvider } from './generate-tokens.provider';

@Injectable()
export class SignInProvider {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly hashingProvider: HashingProvider,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly generateTokenProvider: GenerateTokensProvider
  ) {}

  public async signIn(signInDto: SignInDto) {
    let isEqual: boolean | undefined = false;

    const user = await this.usersService.findByEmail(signInDto.email);
    if (!user) {
      throw new BadRequestException('No such user');
    }

    try {
      isEqual = await this.hashingProvider.comparePassword(
        signInDto.password,
        user.password,
      );
    } catch (error) {
      throw new RequestTimeoutException(error.message, {
        description: 'Cound not compare passwords',
      });
    }

    if (!isEqual) {
      throw new UnauthorizedException('Failed to login, password mismatch');
    }

    const {accessToken, refreshToken} = await this.generateTokenProvider.generateTokens(user);

    // const accessToken = await this.jwtService.signAsync(
    //   {
    //     subject: user.id,
    //     email: user.email,
    //   } as ActiveUserData,
    //   {
    //     secret: this.jwtConfiguration.secret,
    //     audience: this. jwtConfiguration.audience,
    //     issuer: this.jwtConfiguration.issuer,
    //     expiresIn: this.jwtConfiguration.accessTokenTtl
    //   },
    // );
    return {accessToken, refreshToken};
  }
}
