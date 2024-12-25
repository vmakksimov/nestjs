import { Global, Module } from '@nestjs/common';
import { DatabasePrismaService } from './providers/database-prisma.service';

@Global()
@Module({
  providers: [DatabasePrismaService],
  exports: [DatabasePrismaService],
})
export class DatabasePrismaModule {}
