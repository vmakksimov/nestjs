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
import { create } from 'domain';

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

    private readonly dataSource: DataSource,
  ) {}

  /**
   * Checks if the current user is authenticated by delegating the call
   * to the AuthService's isAuth method.
   *
   * @returns {boolean} - True if the user is authenticated, otherwise false.
   */
  private isAuth() {
    return this.authService.isAuth();
  }

  public async createUser(createUserDto: CreateUserDto) {
    let existingUser = undefined;

    try {
      existingUser = await this.usersRepository.findOne({
        where: {
          email: createUserDto.email,
        },
      });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request, please try again',
        {
          description: `Something went wrong with the database: ${error.message}`,
        },
      );
    }

    if (existingUser) {
      throw new BadRequestException(
        `User with email ${createUserDto.email} already exists`,
      );
    }

    let newUser = this.usersRepository.create(createUserDto);

    try {
      newUser = await this.usersRepository.save(newUser);
    } catch (error) {
      throw new RequestTimeoutException('Unable to save user in DB', {
        description: `Something went wrong with the database: ${error.message}`,
      });
    }
    return newUser;
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
    if (this.isAuth()) return 'You are authenticated';

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

  // DB Transaction method
  public async createMany(createUsersDto: CreateUserDto[]) {
    let newUsers: User[] = [];
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    await queryRunner.startTransaction();

    try {
      for (let user of createUsersDto){
        let newUser = queryRunner.manager.create(User, user);
        let result = await queryRunner.manager.save(newUser);
        newUsers.push(result)
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
