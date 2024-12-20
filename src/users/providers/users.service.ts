import {
  Injectable,
  forwardRef,
  Inject,
  RequestTimeoutException,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { GetUsersParamDto } from '../dtos/get-users-params.dto';
import { AuthService } from 'src/auth/providers/auth.service';
import { DataSource, Repository } from 'typeorm';
import { User } from '../user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigType } from '@nestjs/config';
import profileConfig from '../config/profile.config';
import { UsersCreateManyProvider } from './users-create-many.provider';
import { CreateManyUsersDto } from '../dtos/create-many-users.dto';
import { CreateUserProvider } from './create-user.provider';
import { SignInDto } from 'src/auth/dtos/signin.dto';
import { FindOneUserByEmailProvider } from './find-one-user-by-email.provider';
import { FindOneByGoogleIdProvider } from './find-one-by-google-id.provider';
import { CreateGoogleUserProvider } from './create-google-user.provider';
import { GoogleUser } from '../interfaces/google-user-interface';

/** Business logic for users */
@Injectable()
export class UsersService {
  /**
   * Creates an instance of the UsersService.
   *
   * @param {AuthService} authService - An instance of the AuthService, to be used
   * for authentication checks. The forwardRef is used to avoid circular dependencies.
   */
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @Inject(profileConfig.KEY)
    private readonly profileConfiguration: ConfigType<typeof profileConfig>,

    private readonly usersCreateManyProvider: UsersCreateManyProvider,

    private readonly createUserProvider: CreateUserProvider,

    private readonly findOneUserByEmailProvider: FindOneUserByEmailProvider,

    private readonly findOneByGoogleIdProvider: FindOneByGoogleIdProvider,

    private readonly createGoogleUserProvider: CreateGoogleUserProvider

  ) {}

  /**
   * Checks if the current user is authenticated by delegating the call
   * to the AuthService's isAuth method.
   *
   * @returns {boolean} - True if the user is authenticated, otherwise false.
   */


  public async createUser(createUserDto: CreateUserDto) {
    return this.createUserProvider.createUser(createUserDto);
  }
  public findAll(
    getUsersParamDto: GetUsersParamDto,
    limit: number,
    page: number,
  ) {
    // custom exception
    throw new HttpException(
      {
        status: HttpStatus.BAD_REQUEST,
        error: 'This is a custom exception',
        fileName: 'users.service.ts',
        lineNumber: 89,
      },
      HttpStatus.BAD_REQUEST,
    );
    console.log('profile config', this.profileConfiguration);
    // if (this.isAuth()) return 'You are authenticated';

    return [
      {
        firstName: 'John',
        email: 'john@doe.com',
      },
      {
        firstName: 'Jane',
        email: 'jane@doe.com',
      },
    ];
  }
  public async findById(id: number) {
    let user = undefined;
    try {
      user = await this.usersRepository.findOneBy({ id });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request, please try again',
        {
          description: `Something went wrong with the database: ${error.message}`,
        },
      );
    }

    if (!user) {
      throw new BadRequestException(`User with id ${id} does not exist`);
    }

    return user;
  }

  public async findByEmail(email: string) {
    return this.findOneUserByEmailProvider.findOneUserByEmail(email);
  }

  // DB Transaction method
  public async createMany(createManyUsersDto: CreateManyUsersDto) {
    return this.usersCreateManyProvider.createMany(createManyUsersDto);
  }

  public async findOneByGoogleId(googleId: string) {
    return this.findOneByGoogleIdProvider.findOneByGoogleId(googleId);
  }

  public async createGoogleUser(googleUser: GoogleUser){
    return this.createGoogleUserProvider.createGoogleUser(googleUser);
  }

}
