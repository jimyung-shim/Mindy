import { IsArray, IsOptional, IsString, Length } from 'class-validator';

export class SubmitSurveyDto {
  @IsArray() answers!: number[];
  @IsOptional() @IsString() @Length(0, 1000) summary?: string;
}
