import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable, tap, map } from 'rxjs';

@Injectable()
export class DataResponseInterceptor implements NestInterceptor {
  constructor(
    private readonly configService: ConfigService
  ){

  }
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('before...');
    return next.handle().pipe(
      map((data) => ({
        apiVersion: this.configService.get('appConfig.apiVersion'),
        data,
      }))
    
    );
  }
}
