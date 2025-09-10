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
import { LlmService } from 'src/chat/llm.service';
import { MessageRepository } from 'src/chat/repositories/message.repository';
import { PHQ9_QUESTIONS } from './survey.util';

@Injectable()
export class SurveyService {
  constructor(
    @InjectModel(Questionnaire.name)
    private readonly qModel: Model<Questionnaire>,
    private readonly llmService: LlmService,
    private readonly messageRepository: MessageRepository, // [!] 추가
  ) {}

  async analyzeLogForSurvey(
    conversationId: string,
  ): Promise<{ answers: number[]; summary: string }> {
    const messages = await this.messageRepository.list(
      new Types.ObjectId(conversationId),
      200,
    );
    const logText = messages
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .map((m) => `${m.role === 'user' ? '사용자' : '상담가'}: ${m.text}`)
      .join('\n');

    const systemPrompt = [
      'You are a psychological counselor who analyzes conversation logs to fill out a PHQ-9 questionnaire.',
      'Based on the provided conversation log, you must generate a JSON object with two keys: "answers" and "summary".',
      '1. "answers": This must be an array of 9 integers, where each integer is a score from 0 to 3 for the corresponding PHQ-9 question. The questions are:',
      ...PHQ9_QUESTIONS.map((q, i) => `${i + 1}. ${q}`),
      'Score each item from 0 (Not at all) to 3 (Nearly every day). Infer the score from the user\'s statements.',
      '2. "summary": This must be a string that summarizes the user\'s psychological state in Korean, written in 2-3 concise sentences.',
      'Return ONLY the raw JSON object, without any markdown formatting or explanations.',
    ].join('\n');

    const analysisText = await this.llmService.getChatCompletion(
      logText,
      systemPrompt,
    );
    try {
      const result = JSON.parse(analysisText);
      if (
        isValidAnswers(result.answers) &&
        typeof result.summary === 'string'
      ) {
        return { answers: result.answers, summary: result.summary };
      }
    } catch {
      // 파싱 실패 시 기본값 반환
    }
    return {
      answers: Array(9).fill(0),
      summary: '대화 내용 요약에 실패했습니다.',
    };
  }

  async createDraft(params: {
    userId: string;
    conversationId: string;
    reason: TriggerReason;
    answers?: number[];
    summary?: string;
    modelInfo?: { model: string; promptVer: string };
  }) {
    const { userId, conversationId } = params;

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
    if (doc.userId !== userId) throw new ForbiddenException('not owner');
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
      .find({ userId: userId })
      .sort({ createdAt: -1 })
      .limit(limit);
  }

  async findByIdForOwner(userId: string, id: string) {
    const doc = await this.qModel.findById(id);
    if (!doc) throw new NotFoundException();
    if (doc.userId !== userId) throw new ForbiddenException();
    return doc;
  }
}
