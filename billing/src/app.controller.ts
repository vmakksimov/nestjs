import { Controller, Get, Inject, OnModuleInit } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientKafka, Ctx, EventPattern, KafkaContext, Payload } from '@nestjs/microservices';
import {POSTS_PATTERNS} from '../../libs/contracts/src/posts/posts.pattern'
import { AUTH_SERVICE } from './constant';
@Controller()
export class AppController implements OnModuleInit {
  constructor(
    private readonly appService: AppService,
    @Inject(AUTH_SERVICE)
    private readonly authClient: ClientKafka
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @EventPattern('order_created')
  handleOrderCreated(@Payload() data: any, @Ctx() context: KafkaContext){
    console.log('data in billing', data);
    console.log('Received on topic:', context.getTopic());
  console.log('Partition:', context.getPartition());
    return this.appService.handleOrderCreated(data)
  }

  onModuleInit(){
    return this.authClient.subscribeToResponseOf(POSTS_PATTERNS.GET_USER);
  }
}
