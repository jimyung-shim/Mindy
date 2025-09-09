// server/src/survey/survey.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Questionnaire,
  QuestionnaireSchema,
} from '../chat/schemas/questionnaire.schema';
import { SurveyService } from './survey.service';
import { SurveyController } from './survey.controller';
import { SurveyTriggerService } from './survey.trigger';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Questionnaire.name,
        schema: QuestionnaireSchema,
      },
    ]),
  ],
  providers: [SurveyService, SurveyTriggerService],
  controllers: [SurveyController],
  exports: [SurveyTriggerService, SurveyService],
})
export class SurveyModule {}
