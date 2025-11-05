import { IsNotEmpty, IsString, IsArray, ArrayNotEmpty } from "class-validator";
import { TrimString } from "../common/transform";
import { CreateAnalyticsRequestDto as SharedBody } from "pai-shared-types";

export class CreateAnalyticsRequestDto implements SharedBody {
  

  @IsString() @IsNotEmpty() @TrimString()
  childId!: string;

  @IsString() @IsNotEmpty() @TrimString()
  conversationId!: string;

  @IsArray() @ArrayNotEmpty() @IsString({ each: true })
  extractedKeywords!: string[];
}