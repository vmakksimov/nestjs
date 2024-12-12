import {
  BadRequestException,
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { Repository } from 'typeorm';
import { SignInDto } from 'src/auth/dtos/signin.dto';

@Injectable()
export class FindOneUserByEmailProvider {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  public async findOneUserByEmail(email: string) {
    let user: User | undefined = undefined;

    try {
      user = await this.usersRepository.findOne({
        where: { email: email },
      });
    } catch (error) {
      throw new RequestTimeoutException(error.message, {
        description: 'Bad connection to DB.',
      });
    }

    if (!user) {
      throw new UnauthorizedException('No such user in DB');
    }

    return user;
  }
}
