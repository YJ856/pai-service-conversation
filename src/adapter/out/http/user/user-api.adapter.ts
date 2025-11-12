import { HttpService } from "@nestjs/axios";
import { Inject, Injectable, Logger, Scope } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { firstValueFrom } from "rxjs";
import { ChildProfileSummary, UserApiPort } from "src/application/port/out/user-api.port";
import type { Request } from "express";
import { ProfileDto } from "pai-shared-types";

type UserApiResponse = {
  success: boolean;
  message: string;
  data: {
    profiles: ProfileDto[];
  };
};

@Injectable({ scope: Scope.REQUEST })
export class ProfileDirectoryHttpAdapter implements UserApiPort {
  private readonly logger = new Logger(ProfileDirectoryHttpAdapter.name);

  // 베이스 URL, 엔드포인트 => url
  private readonly baseUrl = process.env.USER_SERVICE_BASE_URL ?? 'http://localhost:3001';
  private readonly profilePath = process.env.USER_API_PROFILE_PATH ?? '/api/profiles';
  private readonly url = new URL(this.profilePath, this.baseUrl).toString();

  constructor(
    private readonly http: HttpService,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  async getFamilyProfileWithScopeChildren(): Promise<{ children: ChildProfileSummary[]; }> {
    if (!this.baseUrl) {
      this.logger.warn('USER_SERVICE_BASE_URL is not set');
      return { children: [] };
    }

    const authorization = normalizeBearer(this.request.headers.authorization);

    try {
      const { data } = await firstValueFrom(
        this.http.get<UserApiResponse>(this.url, {
          headers: authorization ? { Authorization: authorization } : undefined,
          params: { profileType: 'child' },
          timeout: 3000,
        }),
      );

      const profiles = data?.data?.profiles ?? [];
      const children: ChildProfileSummary[] = profiles.map((profile) => ({
        profileId: Number(profile.profileId),
        name: String(profile.name ?? ''),
        avatarMediaId: parseBigIntOrNull(profile.avatarMediaId),
      }));
      return { children };
    } catch (error) {
      this.logger.warn(`getFamilyProfileWithScopeChildren failed: ${String(error)}`)
      return { children: [] };
    }
  }

}

function parseBigIntOrNull(input: unknown): bigint | null {
  if (input === null || input === undefined) return null;
  const stringTrimmed = String(input).trim();
  if (!stringTrimmed) return null;
  try { return BigInt(stringTrimmed); } catch { return null }
}

function normalizeBearer(authorizationHeader?: string): string | undefined {
  if (!authorizationHeader) return undefined;
  const match = authorizationHeader.match(/^Bearer\s+(.+)$/i);
  const token = match?.[1]?.trim();
  return token ? `Bearer ${token}` : undefined;
}
