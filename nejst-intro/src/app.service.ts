import { Injectable } from '@nestjs/common';
import {GetUserRequest} from "./get-user-request-dto";
@Injectable()
export class AppService {
  private readonly users: any[] = [
    {
      userId: '123',
      stripeUserId: '432432',
    },
    {
      userId: '3456',
    stripeUserId: '27555'
    }

  ]
  getHello(): string {
    return 'Hello World, Viktor!';
  }

  getUser(getUserRequest: GetUserRequest){
    return this.users.find(user => user.userId === getUserRequest.userId);
  }
}
