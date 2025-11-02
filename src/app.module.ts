import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConversationModule } from './conversation.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ConversationModule
  ],
})
export class AppModule {}
