import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { DataResponseInterceptor } from './common/interceptors/data-response/data-response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: { enableImplicitConversion: true } // converting types (ex. from string to Number)
  }));

  /**
   * swagger config
   */

  const config = new DocumentBuilder()
    .setTitle('NestJS Masterclass')
    .setDescription('The nestjs-intro API description')
    .setTermsOfService('http://localhost:3000/terms')
    .setLicense('MIT License', 'http://github.com/')
    .addServer('http://localhost:3000')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document)

  app.enableCors();

  //global intereceptor
  // app.useGlobalInterceptors(new DataResponseInterceptor());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
