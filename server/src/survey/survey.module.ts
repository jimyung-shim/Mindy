import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Questionnaire,
  QuestionnaireSchema,
} from '../chat/schemas/questionnaire.schema';
import { Phq9, Phq9Schema } from 'src/chat/schemas/phq9.schema';
import { Gad7, Gad7Schema } from 'src/chat/schemas/gad7.schema';
import { Pss, PssSchema } from 'src/chat/schemas/pss.schema';
import { Cbt, CbtSchema } from '../chat/schemas/cbt.schema';
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
      { name: Phq9.name, schema: Phq9Schema },
      { name: Gad7.name, schema: Gad7Schema },
      { name: Pss.name, schema: PssSchema },
      { name: Cbt.name, schema: CbtSchema },
    ]),
    forwardRef(() => ChatModule),
  ],
  providers: [SurveyService, SurveyTriggerService, RiskClassifierService],
  controllers: [SurveyController],
  exports: [SurveyTriggerService, SurveyService],
})
export class SurveyModule {}
