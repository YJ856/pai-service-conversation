import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PrismaService } from './adapter/out/persistence/prisma/prisma.service';

@Module({
  imports: [HttpModule],
  providers: [PrismaService],
})
export class ConversationModule {}