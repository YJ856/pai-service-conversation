import {
  Controller,
  Param,
  Post,
  Get,
  Query,
  UseGuards,
  Inject,
  HttpCode,
  HttpStatus,
  Body,
} from '@nestjs/common';
import { Auth } from '../decorators/auth.decorator';

import type {
  BaseResponse,
  RecordConversationResponseData,
  EndConversationResponseData,
  GetConversationsResponseData,
  GetConversationDetailResponseData,
  GetConversationsCalendarResponseData,
} from 'pai-shared-types';

import { RecordConversationRequestDto } from '../dto/request/record-conversation-request.dto';
import { RecordConversationMapper } from '../mapper/record-conversation.mapper';
import type { RecordConversationUseCase } from 'src/application/port/in/record-conversation.usecase';

import { EndConversationPathParam } from '../dto/request/end-conversation-request.dto';
import { EndConversationMapper } from '../mapper/end-conversation.mapper';
import type { EndConversationUseCase } from 'src/application/port/in/end-conversation.usecase';

import { GetConversationsQueryParam } from '../dto/request/get-conversations-request.dto';
import { GetConversationsMapper } from '../mapper/get-conversations.mapper';
import type { GetConversationsUseCase } from 'src/application/port/in/get-conversations.usecase';

import { GetConversationDetailPathParam } from '../dto/request/get-conversation-detail-request.dto';
import { GetConversationDetailMapper } from '../mapper/get-conversation-detail.mapper';
import type { GetConversationDetailUseCase } from 'src/application/port/in/get-conversation-detail.usecase';

import { GetConversationsCalendarQueryParam } from '../dto/request/get-conversations-calendar-request.dto';
import { GetConversationsCalendarMapper } from '../mapper/get-conversations-calendar.mapper';
import type { GetConversationsCalendarUseCase } from 'src/application/port/in/get-conversations-calendar.usecase';

import { AuthGuard } from '../auth/guards/auth.guard';
import { CONVERSATION_TOKENS } from 'src/conversation.token';

@UseGuards(AuthGuard)
@Controller('api/conversations')
export class ConversationController {
  constructor(
    @Inject(CONVERSATION_TOKENS.RecordConversationUseCase)
    private readonly recordConversationUseCase: RecordConversationUseCase,
    private readonly recordConversationMapper: RecordConversationMapper,

    @Inject(CONVERSATION_TOKENS.EndConversationUseCase)
    private readonly endConversationUseCase: EndConversationUseCase,
    private readonly endConversationMapper: EndConversationMapper,

    @Inject(CONVERSATION_TOKENS.GetConversationsUseCase)
    private readonly getConversationsUseCase: GetConversationsUseCase,
    private readonly getConversationsMapper: GetConversationsMapper,

    @Inject(CONVERSATION_TOKENS.GetConversationDetailUseCase)
    private readonly getConversationDetailUseCase: GetConversationDetailUseCase,
    private readonly getConversationDetailMapper: GetConversationDetailMapper,

    @Inject(CONVERSATION_TOKENS.GetConversationsCalendarUseCase)
    private readonly getConversationsCalendarUseCase: GetConversationsCalendarUseCase,
    private readonly getConversationsCalendarMapper: GetConversationsCalendarMapper,
  ) {}

  @Post('record')
  @HttpCode(HttpStatus.CREATED)
  async recordConversation(
    @Auth('profileId') childProfileId: number,
    @Body() body: RecordConversationRequestDto,
  ): Promise<BaseResponse<RecordConversationResponseData>> {
    const command = this.recordConversationMapper.toCommand(
      childProfileId,
      body,
    );
    const result = await this.recordConversationUseCase.execute(command);
    const data = this.recordConversationMapper.toResponse(result);
    return { success: true, message: '대화 Redis 기록 성공', data };
  }

  @Post(':conversationSessionId/end')
  async endConversation(
    @Auth('profileId') childProfileId: number,
    @Auth('profileType') profileType: 'child' | 'parent',
    @Param() path: EndConversationPathParam,
  ): Promise<BaseResponse<EndConversationResponseData>> {
    const command = this.endConversationMapper.toCommand(
      path,
      childProfileId,
      profileType,
    );
    const result = await this.endConversationUseCase.execute(command);
    const data = this.endConversationMapper.toResponse(result);
    return { success: true, message: '대화 기록 DB 저장', data };
  }

  @Get()
  async getConversations(
    @Query() query: GetConversationsQueryParam,
  ): Promise<BaseResponse<GetConversationsResponseData>> {
    const command = this.getConversationsMapper.toCommand(query);
    const result = await this.getConversationsUseCase.execute(command);
    const data = this.getConversationsMapper.toResponse(result);
    return { success: true, message: '대화 목록 조회 성공', data };
  }

  @Get('calendar')
  async getConversationsCalendar(
    @Query() query: GetConversationsCalendarQueryParam,
  ): Promise<BaseResponse<GetConversationsCalendarResponseData>> {
    const command = this.getConversationsCalendarMapper.toCommand(query);
    const result = await this.getConversationsCalendarUseCase.execute(command);
    const data = this.getConversationsCalendarMapper.toResponse(result);
    return { success: true, message: '달별 대화 요약 조회 성공', data };
  }

  @Get(':conversationId')
  async getConversationDetail(
    @Auth('profileId') childProfileId: number,
    @Param() path: GetConversationDetailPathParam,
  ): Promise<BaseResponse<GetConversationDetailResponseData>> {
    const command = this.getConversationDetailMapper.toCommand(
      path,
      childProfileId,
    );
    const result = await this.getConversationDetailUseCase.execute(command);
    const data = this.getConversationDetailMapper.toResponse(result);
    return { success: true, message: '대화 상세 조회 성공', data };
  }
}
