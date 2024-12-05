import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
dotenv.config();

console.log('configservice', new ConfigService());
export const dbConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // entities: [User],
  autoLoadEntities: true,
  synchronize: true, // Set to false in production
};

export class ConfigServiceEnvironmentVariables {
  constructor(private readonly configService: ConfigService) {}

  public getDatabaseConfig(){
    console.log("this config", this.configService.get('S3_BUCKET'));
    return {
      type: 'postgres',
      host: this.configService.get('DB_HOST'),
      port: parseInt(this.configService.get('DB_PORT'), 10),
      username: this.configService.get('DB_USERNAME'),
      password: this.configService.get('DB_PASSWORD'),
      database: this.configService.get('DB_NAME'),
      // entities: [User],
      autoLoadEntities: true,
      synchronize: true, // Set to false in production
    }
  }
}

const newC = new ConfigServiceEnvironmentVariables(new ConfigService());
console.log("new config", newC.getDatabaseConfig());
