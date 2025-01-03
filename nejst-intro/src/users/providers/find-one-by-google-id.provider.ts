import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { Repository } from 'typeorm';
import { DatabasePrismaService } from 'src/database-prisma/providers/database-prisma.service';

@Injectable()
export class FindOneByGoogleIdProvider {
    constructor(
        private readonly prisma: DatabasePrismaService
    ){

    }

    public async findOneByGoogleId(googleId: string){
        return await this.prisma.user.findUnique({where: {googleId}});
    }
}
