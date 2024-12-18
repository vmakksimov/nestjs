import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from 'src/users/users.module';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbConfig } from './db/config';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import { TagsModule } from './tags/tags.module';
import { MetaOptionsModule } from './meta-options/meta-options.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PaginationModule } from './common/pagination/pagination.module';
import environmentValidation from './config/environment.validation';
import { APP_GUARD, APP_INTERCEPTOR, Reflector } from '@nestjs/core';
import { AccessTokenGuard } from './auth/guards/access-token/access-token.guard';
import jwtConfig from './auth/config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { AuthenticationGuard } from './auth/guards/authentication/authentication.guard';
import { DataResponseInterceptor } from './common/interceptors/data-response/data-response.interceptor';

const ENV = process.env.NODE_ENV;
console.log('ENV', !ENV ? '.env' : `.env.${ENV}`);
@Module({
  imports: [
    UsersModule,
    PostsModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: !ENV ? '.env' : `.env.${ENV}`,
      load: [appConfig, databaseConfig],
      validationSchema: environmentValidation,
    }),
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    // TypeOrmModule.forRoot(dbConfig),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => (
        console.log("config", config),
        console.log('username', config.get('database.username')),
        console.log('password', config.get('database.password')),
        console.log("synchonize", config.get('database.syncronize')),
        {
        type: 'postgres',
        host: config.get('database.host'),
        port: +config.get('database.port'), // convert to number
        username: config.get('database.username'),
        password: config.get('database.password'),
        database: config.get('database.database'),
        autoLoadEntities: true,
        synchronize: config.get('database.syncronize'),
      }),
    }),
    TagsModule,
    MetaOptionsModule,
    PaginationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    Reflector,
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard, // THIS IS GLOBALLY APPLIED ACCROSS ALL MODULES
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: DataResponseInterceptor, // APPLIED GLOBALLY ACROSS ALL MODULES
    },
    AccessTokenGuard, // MUST be present in order to AUTHENTICATIONGUARD to work
  ],
})
export class AppModule {}
