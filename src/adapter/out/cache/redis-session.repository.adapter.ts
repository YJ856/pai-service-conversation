import { Injectable, Inject } from '@nestjs/common';
import { Redis } from 'ioredis';
import { REDIS_CLIENT } from './redis.module';
import type { SessionRepositoryPort } from '../../../application/port/out/session.repository.port';
import { Conversation } from '../../../domain/model/entity/conversation.entity';
import { Question } from '../../../domain/model/entity/question.entity';
import { StartDate } from '../../../domain/model/vo/start-date.vo';
import { QuestionOrder } from '../../../domain/model/vo/question-order.vo';

interface ConversationSnapshot {
  childProfileId: number;
  startDate: string; // ISO string
  questions: QuestionSnapshot[];
}

interface QuestionSnapshot {
  order: number;
  questionText: string;
  imageMediaId: string | null; // bigint를 string으로 저장
  keyword: string | null;
  answerText: string;
}

@Injectable()
export class RedisSessionRepositoryAdapter implements SessionRepositoryPort {
  private readonly TTL_SECONDS = 24 * 60 * 60; // 24시간

  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  private getKey(sessionId: string): string {
    return `conversation:session:${sessionId}`;
  }

  async load(sessionId: string): Promise<Conversation | null> {
    const key = this.getKey(sessionId);
    const data = await this.redis.get(key);

    if (!data) return null;

    try {
      const snapshot = JSON.parse(data) as ConversationSnapshot;

      // Question 객체들 재구성
      const questions = snapshot.questions.map((question) =>
        Question.create({
          order: QuestionOrder.create(question.order),
          questionText: question.questionText,
          imageMediaId: question.imageMediaId
            ? BigInt(question.imageMediaId)
            : null,
          keyword: question.keyword,
          answerText: question.answerText,
        }),
      );

      // Conversation 객체 재구성
      const conversation = Conversation.create({
        childProfileId: snapshot.childProfileId,
        startDate: StartDate.ofISO(snapshot.startDate),
      });

      // 질문들을 순차적으로 추가
      for (const question of questions) {
        conversation.addQuestion(question);
      }

      return conversation;
    } catch (error) {
      console.error('Failed to parse conversation from Redis:', error);
      return null;
    }
  }

  async save(sessionId: string, conversation: Conversation): Promise<void> {
    const key = this.getKey(sessionId);

    // Conversation을 직렬화 가능한 형태로 변환
    const snapshot: ConversationSnapshot = {
      childProfileId: conversation.getChildProfileId(),
      startDate: conversation.getStartDate().toISO(),
      questions: conversation.getQuestions().map((question) => ({
        order: question.getOrder().value,
        questionText: question.getQuestionText(),
        imageMediaId: question.getImageMediaId()?.toString() ?? null,
        keyword: question.getKeyword(),
        answerText: question.getAnswerText(),
      })),
    };

    await this.redis.set(key, JSON.stringify(snapshot), 'EX', this.TTL_SECONDS);
  }

  async delete(sessionId: string): Promise<void> {
    const key = this.getKey(sessionId);
    await this.redis.del(key);
  }
}
