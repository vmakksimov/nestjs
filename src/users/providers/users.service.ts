import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { GetUsersParamDto } from '../dtos/get-users-params.dto';
import { AuthService } from 'src/auth/providers/auth.service';


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
    private readonly authService: AuthService
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
  public findById(id: string) {
    if (this.authService.isAuth()){
      return {
        id: 12,
        firstName: 'John',
        email: 'john@doe.com',
      }
    } else {
      return {
        message: 'User is not authenticated'
    } 
    }
  }
    
}
