// server/src/survey/survey.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Questionnaire,
  QuestionnaireSchema,
} from '../chat/schemas/questionnaire.schema';
import { SurveyService } from './survey.service';
import { SurveyController } from './survey.controller';
import { SurveyTriggerService } from './survey.trigger';
import { ChatModule } from 'src/chat/chat.module';
import { RiskClassifierService } from 'src/risk/risk.classifier.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Questionnaire.name,
        schema: QuestionnaireSchema,
      },
    ]),
    forwardRef(() => ChatModule),
  ],
  providers: [SurveyService, SurveyTriggerService, RiskClassifierService],
  controllers: [SurveyController],
  exports: [SurveyTriggerService, SurveyService],
})
export class SurveyModule {}
