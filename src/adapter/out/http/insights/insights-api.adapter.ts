import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { InsightsApiPort } from '../../../../application/port/out/insights-api.port';

interface AnalyticsRequest {
  keywords: string[];
}

interface AnalyticsResponse {
  title: string;
}

@Injectable()
export class InsightsApiAdapter implements InsightsApiPort {
  private readonly insightsApiBaseUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.insightsApiBaseUrl =
      this.configService.get<string>('INSIGHTS_API_URL') || 'http://localhost:3003';
  }

  async generateTitle(keywords: string[]): Promise<string> {
    try {
      const url = `${this.insightsApiBaseUrl}/api/insights/analytics`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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

      return data.title;
    } catch (error) {
      console.error('Failed to generate title from Insights API:', error);
      // 실패 시 기본 제목 반환
      return '대화 기록';
    }
  }
}
