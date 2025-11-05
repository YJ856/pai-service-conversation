import { Injectable, Scope, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';
import type { InsightsApiPort } from '../../../../application/port/out/insights-api.port';
import { InsightRequestMapper } from 'src/adapter/in/http/mapper/insights-api-request.mapper';

@Injectable({ scope: Scope.REQUEST })
export class InsightsApiAdapter implements InsightsApiPort {
  private readonly insightsApiBaseUrl: string;

  constructor(
    private readonly configService: ConfigService,
    @Inject(REQUEST) private readonly request: Request,

    @Inject()
    private readonly insightRequestMapper: InsightRequestMapper,
  ) {
    this.insightsApiBaseUrl =
      this.configService.get<string>('INSIGHTS_API_URL') || 'http://localhost:3003';
  }

  async generateTitle(conversationId:bigint, profileId: number, keywords: string[]): Promise<void> {
    const url = `${this.insightsApiBaseUrl}/api/insights/analytics`;
    const authorization = this.normalizeBearer(this.request.headers.authorization);
    const data = this.insightRequestMapper.toRequestDto(conversationId, profileId, keywords)
    console.log('Original auth header:', this.request.headers.authorization)
    console.log('Normalized auth:', authorization)
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authorization ? { Authorization: authorization } : {}),
      },
      // body: JSON.stringify({ conversationId: String(conversationId), childId: String(profileId), extractedKeywords: keywords } as CreateAnalyticsRequestDto),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(
        `Insights API returned ${response.status}: ${response.statusText}`
      );
    }  
  }

  private normalizeBearer(authorizationHeader?: string): string | undefined {
    if (!authorizationHeader) return undefined;
    const match = authorizationHeader.match(/^Bearer\s+(.+)$/i);
    const token = match?.[1]?.trim();
    return token ? `Bearer ${token}` : undefined;
  }
}
