import { Inject, Injectable } from '@nestjs/common';
import { OrderCreatedEvent } from './events/order-created-event';
import { ClientKafka } from '@nestjs/microservices';
import { GetUserRequest } from './dtos/get-user-request.dto';

@Injectable()
export class AppService {
  constructor(
    @Inject('AUTH_SERVICE')
    private readonly authClient: ClientKafka
  ){

  }
  getHello(): string {
    return 'Hello World!';
  }

  handleOrderCreated(orderCreatedEvent: OrderCreatedEvent){
    console.log('orderCreatedEvent', orderCreatedEvent);
    return this.authClient
    .send('get_user', new GetUserRequest(orderCreatedEvent.userId))
    .subscribe((data) => {
      console.log(`billing user with stripe id ${data.data.stripeUserId} with price ${orderCreatedEvent.price}`,data)
    })
  }
}
