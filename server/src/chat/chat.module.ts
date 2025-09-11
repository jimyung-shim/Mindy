import { Module, forwardRef } from '@nestjs/common';
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
import { PersonaService } from 'src/persona/persona.service';
import { SurveyTriggerService } from 'src/survey/survey.trigger';
import { RiskClassifierService } from 'src/risk/risk.classifier.service';
import { SurveyModule } from 'src/survey/survey.module';
import { Phq9, Phq9Schema } from './schemas/phq9.schema';
import { Gad7, Gad7Schema } from './schemas/gad7.schema';
import { Pss, PssSchema } from './schemas/pss.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Conversation.name, schema: ConversationSchema },
      { name: Message.name, schema: MessageSchema },
    ]),
    forwardRef(() => SurveyModule),
  ],
  controllers: [ChatController],
  providers: [
    ChatGateway,
    ChatService,
    LlmService,
    ConversationRepository,
    MessageRepository,
    WsJwtGuard,
    PersonaService,
    SurveyTriggerService,
    RiskClassifierService,
  ],
  exports: [ChatGateway, ChatService, LlmService, MessageRepository],
})
export class ChatModule {}
