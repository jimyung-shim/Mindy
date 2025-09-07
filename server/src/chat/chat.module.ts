import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { LlmService } from './llm.service';
import {
  Conversation,
  ConversationSchema,
} from './schemas/conversation.schema';
import { Message, MessageSchema } from './schemas/message.schema';
import {
  Questionnaire,
  QuestionnaireSchema,
} from './schemas/questionnaire.schema';
import { ConversationRepository } from './repositories/conversation.repository';
import { MessageRepository } from './repositories/message.repository';
import { WsJwtGuard } from './auth/ws-jwt.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Conversation.name, schema: ConversationSchema },
      { name: Message.name, schema: MessageSchema },
      { name: Questionnaire.name, schema: QuestionnaireSchema },
    ]),
  ],
  controllers: [ChatController],
  providers: [
    ChatGateway,
    ChatService,
    LlmService,
    ConversationRepository,
    MessageRepository,
    WsJwtGuard,
  ],
  exports: [],
})
export class ChatModule {}
