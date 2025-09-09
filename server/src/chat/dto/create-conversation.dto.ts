import { IsOptional, IsString } from 'class-validator';
import type { PersonaKey } from 'src/persona/persona.types';

export class CreateConversationDto {
  @IsOptional()
  @IsString()
  title?: string; // 필요시

  @IsOptional() // [!] 추가
  @IsString()
  personaKey?: PersonaKey;
}
