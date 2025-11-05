import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { CONVERSATION_TOKENS } from './conversation.token';

// Controllers
import { ConversationController } from './adapter/in/http/controllers/conversation.controller';

// Mappers
import { RecordConversationMapper } from './adapter/in/http/mapper/record-conversation.mapper';
import { EndConversationMapper } from './adapter/in/http/mapper/end-conversation.mapper';
import { GetConversationsMapper } from './adapter/in/http/mapper/get-conversations.mapper';
import { GetConversationDetailMapper } from './adapter/in/http/mapper/get-conversation-detail.mapper';

// Use Cases
import { RecordConversationService } from './application/use-cases/record-conversation.service';
import { EndConversationService } from './application/use-cases/end-conversation.service';
import { GetConversationsService } from './application/use-cases/get-conversations.service';
import { GetConversationDetailService } from './application/use-cases/get-conversation-detail.service';

// Adapters - Cache
import { RedisModule } from './adapter/out/cache/redis.module';
import { RedisSessionRepositoryAdapter } from './adapter/out/cache/redis-session.repository.adapter';

// Adapters - Persistence
import { PrismaModule } from './adapter/out/persistence/prisma/prisma.module';
import { ConversationRepositoryAdapter } from './adapter/out/persistence/conversation/conversation.repository.adapter';
import { ConversationQueryAdapter } from './adapter/out/persistence/conversation/conversation.query.adapter';

// Adapters - ID Generator
import { UuidIdGeneratorAdapter } from './adapter/out/id/uuid-id-generator.adapter';

// Adapters - HTTP
import { InsightsApiAdapter } from './adapter/out/http/insights/insights-api.adapter';
import { RedisTokenVersionQueryAdapter } from './adapter/out/cache/redis-token-version.query.adapter';
import { InsightRequestMapper } from './adapter/in/http/mapper/insights-api-request.mapper';

@Module({
  imports: [
    ConfigModule,
    RedisModule,
    PrismaModule,
  ],
  controllers: [ConversationController],
  providers: [
    // Mappers
    RecordConversationMapper,
    EndConversationMapper,
    GetConversationsMapper,
    GetConversationDetailMapper,
    InsightRequestMapper,

    // Use Cases
    {
      provide: CONVERSATION_TOKENS.RecordConversationUseCase,
      useClass: RecordConversationService,
    },
    {
      provide: CONVERSATION_TOKENS.EndConversationUseCase,
      useClass: EndConversationService,
    },
    {
      provide: CONVERSATION_TOKENS.GetConversationsUseCase,
      useClass: GetConversationsService,
    },
    {
      provide: CONVERSATION_TOKENS.GetConversationDetailUseCase,
      useClass: GetConversationDetailService,
    },

    // Ports - Session Repository
    {
      provide: CONVERSATION_TOKENS.SessionRepositoryPort,
      useClass: RedisSessionRepositoryAdapter,
    },
    {
      provide: CONVERSATION_TOKENS.TokenVersionQueryPort,
      useClass: RedisTokenVersionQueryAdapter,
    },

    // Ports - Conversation Repository
    {
      provide: CONVERSATION_TOKENS.ConversationRepositoryPort,
      useClass: ConversationRepositoryAdapter,
    },

    // Ports - Conversation Query
    {
      provide: CONVERSATION_TOKENS.ConversationQueryPort,
      useClass: ConversationQueryAdapter,
    },

    // Ports - ID Generator
    {
      provide: CONVERSATION_TOKENS.IdGeneratorPort,
      useClass: UuidIdGeneratorAdapter,
    },

    // Ports - Insights API
    {
      provide: CONVERSATION_TOKENS.InsightsApiPort,
      useClass: InsightsApiAdapter,
    },
  ],
})
export class ConversationModule {}