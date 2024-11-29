import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService
) {}
  public login(email: string, password: string, id: string) {
    const user = this.usersService.findById(id);
    return 'SAMPLE_TOKEN';
    //check if the user exists in DB
    //after login returns a token
  }

  public isAuth() {
    return true;
  }
}
