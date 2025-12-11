import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './adapter/out/persistence/prisma/prisma.module';
import { ConversationModule } from './conversation.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    ConversationModule,
  ],
})
export class AppModule {}
