import { BadRequestException, forwardRef, Inject, Injectable, RequestTimeoutException } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { HashingProvider } from 'src/auth/providers/hashing.provider';
import { DatabasePrismaService } from 'src/database-prisma/providers/database-prisma.service';

@Injectable()
export class CreateUserProvider {
    constructor(
        private readonly prisma: DatabasePrismaService,
        @Inject(forwardRef(() => HashingProvider))
        private readonly hashingProvider: HashingProvider
    ){

    }
    public async createUser(createUserDto: CreateUserDto) {
        let existingUser = undefined;
        console.log('here before create user provide')
        try {
          existingUser = await this.prisma.user.findUnique({
            where: {
              email: createUserDto.email,
            },
          })
        } catch (error) {
          throw new RequestTimeoutException(
            'Unable to process your request, please try again',
            {
              description: `Something went wrong with the database: ${error.message}`,
            },
          );
        }
    
        if (existingUser) {
          throw new BadRequestException(
            `User with email ${createUserDto.email} already exists`,
          );
        }
    
        // let newUser = this.prisma.user.create({
        //     ...createUserDto, // copies all the properties from createUserDto and creates new object
        //     password: await this.hashingProvider.hashPassword(createUserDto.password), 
        // });
    
        try {
          const newUser = await this.prisma.user.create({
            data: {
              ...createUserDto, // Copies all the properties from createUserDto
              password: await this.hashingProvider.hashPassword(
                createUserDto.password,
              ),
            },
          });
    
          return newUser;
        } catch (error) {
          throw new RequestTimeoutException('Unable to save user in DB', {
            description: `Something went wrong with the database: ${error.message}`,
          });
        }
        
      }
}
