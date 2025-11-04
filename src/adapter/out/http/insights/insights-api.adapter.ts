import { Injectable, Scope, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';
import type { InsightsApiPort } from '../../../../application/port/out/insights-api.port';

interface AnalyticsRequest {
  keywords: string[];
}

interface AnalyticsResponse {
  title: string;
}

@Injectable({ scope: Scope.REQUEST })
export class InsightsApiAdapter implements InsightsApiPort {
  private readonly insightsApiBaseUrl: string;

  constructor(
    private readonly configService: ConfigService,
    @Inject(REQUEST) private readonly request: Request,
  ) {
    this.insightsApiBaseUrl =
      this.configService.get<string>('INSIGHTS_API_URL') || 'http://localhost:3003';
  }

  async generateTitle(keywords: string[]): Promise<string> {
    try {
      const url = `${this.insightsApiBaseUrl}/api/insights/analytics`;
      const authorization = this.normalizeBearer(this.request.headers.authorization);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authorization ? { Authorization: authorization } : {}),
        },
        body: JSON.stringify({ keywords } as AnalyticsRequest),
      });

      if (!response.ok) {
        throw new Error(
          `Insights API returned ${response.status}: ${response.statusText}`
        );
      }

      const data: AnalyticsResponse = await response.json();

      if (!data.title) {
        throw new Error('Insights API did not return a title');
      }
      console.log(data);

      return data.title;
    } catch (error) {
      console.error('Failed to generate title from Insights API:', error);
      // 실패 시 기본 제목 반환
      return '대화 기록';
    }
  }

  private normalizeBearer(authorizationHeader?: string): string | undefined {
    if (!authorizationHeader) return undefined;
    const match = authorizationHeader.match(/^Bearer\s+(.+)$/i);
    const token = match?.[1]?.trim();
    return token ? `Bearer ${token}` : undefined;
  }
}
