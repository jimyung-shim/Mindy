import { IsOptional, IsString, Length } from 'class-validator';
import type { PersonaKey, DialogueStyle } from 'src/persona/persona.types';

export class CreateMessageDto {
  @IsString()
  conversationId!: string;

  @IsString()
  @Length(8, 64)
  clientMsgId!: string; // 멱등키

  @IsString()
  @Length(1, 4000)
  text!: string;

  @IsOptional() // [!] 추가: 새 대화 시작 시에만 전달됨
  @IsString()
  personaKey?: PersonaKey;

  @IsOptional()
  @IsString()
  dialogueStyle?: DialogueStyle;
}
