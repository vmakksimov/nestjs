import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';

@Injectable()
export class PostsService {
  constructor(private readonly usersService: UsersService) {}
  public findAll(userId: string) {
    const user = this.usersService.findById(userId);
    console.log('userId', userId);
    return [
      {
        user,
        title: 'Test title',
        content: 'Test content',
      },
      {
        user,
        title: 'Test title1',
        content: 'Test contenct2',
      },
    ];
  }
}
