import { Injectable, Scope, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';
import type { MediaApiPort } from '../../../../application/port/out/media-api.port';

@Injectable({ scope: Scope.REQUEST })
export class MediaApiAdapter implements MediaApiPort {
  private readonly mediaApiBaseUrl: string;

  constructor(
    private readonly configService: ConfigService,
    @Inject(REQUEST) private readonly request: Request,
  ) {
    this.mediaApiBaseUrl =
      this.configService.get<string>('MEDIA_API_URL') || 'http://localhost:3002';
  }

  async batchDelete(mediaIds: bigint[]): Promise<void> {
    if (!mediaIds || mediaIds.length === 0) {
      return;
    }

    const url = `${this.mediaApiBaseUrl}/api/media/batch`;
    const authorization = this.normalizeBearer(this.request.headers.authorization);

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(authorization ? { Authorization: authorization } : {}),
      },
      body: JSON.stringify({
        mediaIds: mediaIds.map(id => id.toString()),
      }),
    });

    if (!response.ok) {
      console.error(
        `Media batch delete failed: ${response.status} ${response.statusText}`
      );
      // 미디어 삭제 실패는 대화 종료를 막지 않음 (로그만 남김)
    }
  }

  private normalizeBearer(authorizationHeader?: string): string | undefined {
    if (!authorizationHeader) return undefined;
    const match = authorizationHeader.match(/^Bearer\s+(.+)$/i);
    const token = match?.[1]?.trim();
    return token ? `Bearer ${token}` : undefined;
  }
}
