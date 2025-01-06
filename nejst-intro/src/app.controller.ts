import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import {MessagePattern, Payload} from '@nestjs/microservices'
import { Auth } from './auth/decorators/auth.decorator';
import { AuthType } from './auth/enums/auth-type.enum';
import {GetUserRequestDto} from '../../libs/contracts/src/posts/dto/create-order-request-dto'
import {POSTS_PATTERNS} from '../../libs/contracts/src/posts/posts.pattern'
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Auth(AuthType.None)
  @MessagePattern(POSTS_PATTERNS.GET_USER)
  getUser(@Payload() data: GetUserRequestDto) {
    console.log('data', data);
    return this.appService.getUser(data);
  }
}
