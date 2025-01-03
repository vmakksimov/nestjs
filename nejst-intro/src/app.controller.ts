import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import {MessagePattern} from '@nestjs/microservices'
import { Auth } from './auth/decorators/auth.decorator';
import { AuthType } from './auth/enums/auth-type.enum';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Auth(AuthType.None)
  @MessagePattern('get_user')
  getUser(data: any) {
    console.log('data', data);
    return this.appService.getUser(data);
  }
}
