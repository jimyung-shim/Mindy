// server/src/survey/survey.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { SurveyService } from './survey.service';
import { CreateDraftDto } from './dto/draft.dto';
import { SubmitSurveyDto } from './dto/submit.dto';
import { TriggerReason } from '../chat/schemas/questionnaire.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('surveys')
@UseGuards(JwtAuthGuard)
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) {}

  @Post('draft')
  async createDraft(@Req() req: any, @Body() body: CreateDraftDto) {
    const userId = req.user.userId as string;
    const doc = await this.surveyService.createDraft({
      userId,
      conversationId: body.conversationId,
      reason: body.reason as TriggerReason,
      answers: body.answers,
      summary: body.summary,
      modelInfo: { model: 'gpt-4o-mini', promptVer: 'phq9-v1' },
    });
    return {
      id: doc._id.toString(),
      status: doc.status,
      conversationId: doc.conversationId,
      answers: doc.answers,
      summary: doc.summary,
    };
  }

  @Post(':id/submit')
  async submit(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: SubmitSurveyDto,
  ) {
    const userId = req.user.userId as string;
    const doc = await this.surveyService.submit(userId, id, {
      answers: body.answers,
      summary: body.summary,
    });
    return {
      id: doc._id.toString(),
      status: doc.status,
      totalScore: doc.totalScore,
      submittedAt: doc.submittedAt,
    };
  }

  @Get('me')
  async listMine(@Req() req: any, @Query('limit') limit?: string) {
    const userId = req.user.userId as string;
    const docs = await this.surveyService.listMine(
      userId,
      limit ? Number(limit) : 20,
    );
    return docs.map((d) => ({
      id: d._id.toString(),
      conversationId: d.conversationId,
      status: d.status,
      totalScore: d.totalScore,
      generatedAt: d.generatedAt,
      submittedAt: d.submittedAt,
      reason: d.reason,
    }));
  }

  @Get(':id')
  async getOne(@Req() req: any, @Param('id') id: string) {
    const userId = req.user.userId as string;
    const d = await this.surveyService.findByIdForOwner(userId, id);
    return {
      id: d._id.toString(),
      conversationId: d.conversationId,
      status: d.status,
      answers: d.answers,
      totalScore: d.totalScore,
      summary: d.summary,
      reason: d.reason,
      generatedAt: d.generatedAt,
      submittedAt: d.submittedAt,
    };
  }

  @Delete(':id')
  async delete(@Req() req: any, @Param('id') id: string) {
    const userId = req.user.userId as string;
    await this.surveyService.deleteForOwner(userId, id);
    return { ok: true };
  }
}
