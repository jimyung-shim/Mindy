import { IsMongoId, IsString, Length } from 'class-validator';

export class CreateMessageDto {
  @IsMongoId()
  conversationId!: string;

  @IsString()
  @Length(8, 64)
  clientMsgId!: string; // 멱등키

  @IsString()
  @Length(1, 4000)
  text!: string;
}
