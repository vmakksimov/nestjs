import {
  BadRequestException,
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SignInDto } from 'src/auth/dtos/signin.dto';
import { DatabasePrismaService } from 'src/database-prisma/providers/database-prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class FindOneUserByEmailProvider {
  constructor(
    private readonly prisma: DatabasePrismaService,
  ) {}

  public async findOneUserByEmail(email: string) {
    let user: User | undefined = undefined;

    try {
      user = await this.prisma.user.findUnique({
        where: {
          email,
        },
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
