import { Injectable } from "@nestjs/common";
import { CreateAnalyticsRequestDto } from "../dto/request/insights-api-request.dto";

@Injectable()
export class InsightRequestMapper {
  toRequestDto(conversationId: bigint, profileId: number, extractedKeywords: string[]): CreateAnalyticsRequestDto {
    return {
      childId: String(profileId),
      conversationId: String(conversationId),
      extractedKeywords,
    }
  }
}