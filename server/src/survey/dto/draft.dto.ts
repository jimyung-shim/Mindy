import {
  IsArray,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { TriggerReason } from '../../chat/schemas/questionnaire.schema';

export class CreateDraftDto {
  @IsMongoId() conversationId!: string;
  @IsEnum(TriggerReason) reason!: TriggerReason;
  @IsOptional() @IsArray() answers?: number[];
  @IsOptional() @IsString() @Length(0, 1000) summary?: string;
}
