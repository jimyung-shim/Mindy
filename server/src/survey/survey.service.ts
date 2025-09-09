import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Questionnaire,
  QuestionnaireStatus,
  TriggerReason,
} from '../chat/schemas/questionnaire.schema';
import { isValidAnswers, calcTotalScore } from './survey.util';

@Injectable()
export class SurveyService {
  constructor(
    @InjectModel(Questionnaire.name)
    private readonly qModel: Model<Questionnaire>,
  ) {}

  async createDraft(params: {
    userId: string;
    conversationId: string;
    reason: TriggerReason;
    answers?: number[];
    summary?: string;
    modelInfo?: { model: string; promptVer: string };
  }) {
    const userId = new Types.ObjectId(params.userId);
    const conversationId = new Types.ObjectId(params.conversationId);

    const exists = await this.qModel.findOne({
      userId,
      conversationId,
      status: QuestionnaireStatus.Draft,
    });
    if (exists) return exists;

    const answers = isValidAnswers(params.answers) ? params.answers : undefined;
    const doc = await this.qModel.create({
      userId,
      conversationId,
      reason: params.reason,
      answers,
      totalScore: answers ? calcTotalScore(answers) : 0,
      summary: params.summary ?? '',
      status: QuestionnaireStatus.Draft,
      generatedAt: new Date(),
      modelInfo: params.modelInfo,
    });
    return doc;
  }

  async submit(
    userId: string,
    id: string,
    payload: { answers: number[]; summary?: string },
  ) {
    const _id = new Types.ObjectId(id);
    const doc = await this.qModel.findById(_id);
    if (!doc) throw new NotFoundException('survey not found');
    if (doc.userId.toString() !== userId)
      throw new ForbiddenException('not owner');
    if (!isValidAnswers(payload.answers))
      throw new BadRequestException('answers must be int[9] in 0..3');

    doc.answers = payload.answers;
    doc.totalScore = calcTotalScore(payload.answers);
    doc.summary = payload.summary ?? '';
    doc.status = QuestionnaireStatus.Submitted;
    doc.submittedAt = new Date();
    return doc.save();
  }

  listMine(userId: string, limit = 20) {
    return this.qModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .limit(limit);
  }

  async findByIdForOwner(userId: string, id: string) {
    const doc = await this.qModel.findById(id);
    if (!doc) throw new NotFoundException();
    if (doc.userId.toString() !== userId) throw new ForbiddenException();
    return doc;
  }
}
