import { Inject, Injectable, NotFoundException } from "@nestjs/common";

import type { EndConversationUseCase } from "../port/in/end-conversation.usecase";
import type { EndConversationResponseResult } from "../port/in/result/end-conversation-result.dto";
import type { SessionRepositoryPort } from "../port/out/session.repository.port";
import type { ConversationRepositoryPort } from "../port/out/conversation.repository.port";
import type { InsightsApiPort } from "../port/out/insights-api.port";
import type { MediaApiPort } from "../port/out/media-api.port";

import { EndConversationCommand } from "../command/end-conversation.command";
import { CONVERSATION_TOKENS } from "../../conversation.token";

@Injectable()
export class EndConversationService implements EndConversationUseCase {
    constructor(
        @Inject(CONVERSATION_TOKENS.SessionRepositoryPort)
        private readonly sessionRepository: SessionRepositoryPort,

        @Inject(CONVERSATION_TOKENS.ConversationRepositoryPort)
        private readonly conversationRepository: ConversationRepositoryPort,

        @Inject(CONVERSATION_TOKENS.InsightsApiPort)
        private readonly insightsApi: InsightsApiPort,

        @Inject(CONVERSATION_TOKENS.MediaApiPort)
        private readonly mediaApi: MediaApiPort,
    ) {}

    async execute(command: EndConversationCommand): Promise<EndConversationResponseResult> {

        // 1. Redis에서 세션 로드
        const conversation = await this.sessionRepository.load(command.conversationSessionId);

        if (!conversation) {
            throw new NotFoundException('CONVERSATION_SESSION_NOT_FOUND');
        }

        // 2. profileType이 parent면 미디어 삭제 후 Redis 삭제하고 종료
        if (command.profileType === 'parent') {
            // 2-1. 대화에 포함된 모든 미디어 ID 추출
            const mediaIds = conversation
                .getQuestions()
                .map(question => question.getImageMediaId())
                .filter((id): id is bigint => id !== null);

            // 2-2. 미디어 일괄 삭제 (비동기로 실행, 실패해도 진행)
            this.mediaApi.batchDelete(mediaIds).catch((error) => {
                console.error('Failed to delete media for parent conversation:', error);
            });

            // 2-3. Redis 삭제
            await this.sessionRepository.delete(command.conversationSessionId);
            return {}; // conversationId 없이 반환
        }

        // 3. profileType이 child인 경우: DB에 저장

        // 3-1. 대화 종료 표시
        conversation.end();

        // 3-2. 키워드 추출 및 제목 설정
        const title = conversation.getQuestions()[0].getKeyword()!;
        const keywords = conversation
            .getQuestions()
            .map(question => question.getKeyword())
            .filter((keyword): keyword is string => keyword != null && keyword.trim() !== '');
        conversation.setTitleFromInsight(title);

        // 3-3. DB에 저장
        const savedConversation = await this.conversationRepository.save(conversation);
        const conversationId = savedConversation.getId();
        const profileId = command.childProfileId;
 
        // // 3-4. Insights API에 데이터 전달
        await this.insightsApi.generateTitle(conversationId, profileId, keywords);
        
        // 3-5. Redis에서 삭제
        await this.sessionRepository.delete(command.conversationSessionId);

        // 3-6. 결과 반환
        return {
            conversationId: savedConversation.getId() ?? undefined,
        };
    }
}
