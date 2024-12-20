import { BadRequestException, forwardRef, Inject, Injectable, RequestTimeoutException } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { User } from '../user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingProvider } from 'src/auth/providers/hashing.provider';

@Injectable()
export class CreateUserProvider {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,


        @Inject(forwardRef(() => HashingProvider))
        private readonly hashingProvider: HashingProvider
    ){

    }
    public async createUser(createUserDto: CreateUserDto) {
        let existingUser = undefined;
        console.log('here before create user provide')
        try {
          existingUser = await this.usersRepository.findOne({
            where: {
              email: createUserDto.email,
            },
          });
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
    
        let newUser = this.usersRepository.create({
            ...createUserDto, // copies all the properties from createUserDto and creates new object
            password: await this.hashingProvider.hashPassword(createUserDto.password), 
        });
    
        try {
          newUser = await this.usersRepository.save(newUser);
        } catch (error) {
          throw new RequestTimeoutException('Unable to save user in DB', {
            description: `Something went wrong with the database: ${error.message}`,
          });
        }
        return newUser;
      }
}
