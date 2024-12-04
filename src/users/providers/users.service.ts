import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { GetUsersParamDto } from '../dtos/get-users-params.dto';
import { AuthService } from 'src/auth/providers/auth.service';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';


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
    private readonly usersRepository: Repository<User>
  ){}

/**
 * Checks if the current user is authenticated by delegating the call
 * to the AuthService's isAuth method.
 *
 * @returns {boolean} - True if the user is authenticated, otherwise false.
 */
  private isAuth(){
    return this.authService.isAuth();
  }

  public async createUser(createUserDto: CreateUserDto) {
    const existingUser = await this.usersRepository.findOne({
      where: {
        email: createUserDto.email
      }
    })

    if (existingUser) {
      throw new Error('User already exists')
    }
    let user = this.usersRepository.create(createUserDto);
    user = await this.usersRepository.save(user)
    return user

  }
  public findAll(
    getUsersParamDto: GetUsersParamDto,
    limit: number,
    page: number,
  ) {
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
    return await this.usersRepository.findOneBy({id})
  }
    
}
