import { forwardRef, Module } from '@nestjs/common';
import { TagsController } from './tags.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from './tag.entity';
import { TagsService } from './providers/tags.service';
import { DatabasePrismaService } from 'src/database-prisma/providers/database-prisma.service';

@Module({
  controllers: [TagsController],
  imports: [TypeOrmModule.forFeature([Tag])],
  providers: [TagsService, DatabasePrismaService],
  exports: [TagsService],
})
export class TagsModule {}
