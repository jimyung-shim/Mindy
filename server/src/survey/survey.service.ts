import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model, Types, Connection } from 'mongoose';
import {
  Questionnaire,
  TriggerReason,
} from '../chat/schemas/questionnaire.schema';
import { Phq9 } from '../chat/schemas/phq9.schema';
import { Gad7 } from '../chat/schemas/gad7.schema';
import { Pss } from '../chat/schemas/pss.schema';
import {
  calcTotalScore,
  PHQ9_QUESTIONS,
  GAD7_QUESTIONS,
  PSS_QUESTIONS,
} from './survey.util';
import { LlmService } from 'src/chat/llm.service';
import { MessageRepository } from 'src/chat/repositories/message.repository';

@Injectable()
export class SurveyService {
  constructor(
    @InjectConnection() private readonly connection: Connection, // DB Connection 주입
    @InjectModel(Questionnaire.name)
    private readonly qModel: Model<Questionnaire>,
    @InjectModel(Phq9.name) private readonly phq9Model: Model<Phq9>,
    @InjectModel(Gad7.name) private readonly gad7Model: Model<Gad7>,
    @InjectModel(Pss.name) private readonly pssModel: Model<Pss>,
    private readonly llmService: LlmService,
    private readonly messageRepository: MessageRepository,
  ) {}

  async analyzeLogForSurvey(conversationId: string) {
    const messages = await this.messageRepository.list(
      new Types.ObjectId(conversationId),
      200,
    );
    const logText = messages
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .map((m) => `${m.role === 'user' ? '사용자' : '상담가'}: ${m.text}`)
      .join('\n');

    const systemPrompt = [
      'You are an AI psychologist. Based on the conversation log, you must generate a JSON object with keys: "summary", "phq9_answers", "gad7_answers", "pss_answers".',
      '1. "summary": Summarize the user\'s state in 2-3 Korean sentences.',
      `2. "phq9_answers": An array of 9 integers (0-3) for the PHQ-9 questions. Questions are: ${JSON.stringify(PHQ9_QUESTIONS)}`,
      `3. "gad7_answers": An array of 7 integers (0-3) for the GAD-7 questions. Questions are: ${JSON.stringify(GAD7_QUESTIONS)}`,
      `4. "pss_answers": An array of 10 integers (0-4) for the PSS questions. Questions are: ${JSON.stringify(PSS_QUESTIONS)}`,
      'Return ONLY the raw JSON object.',
    ].join('\n');

    const analysisText = await this.llmService.getChatCompletion(
      logText,
      systemPrompt,
    );
    try {
      const result = JSON.parse(analysisText);
      if (
        result.phq9_answers?.length === 9 &&
        result.gad7_answers?.length === 7 &&
        result.pss_answers?.length === 10
      ) {
        return result;
      }
    } catch {
      // 파싱 실패 시 기본값 반환
    }
    return {
      summary: '분석 실패',
      phq9_answers: Array(9).fill(0),
      gad7_answers: Array(7).fill(0),
      pss_answers: Array(10).fill(0),
    };
  }

  async createDraft(params: {
    userId: string;
    conversationId: string;
    reason: TriggerReason;
    analysis: {
      summary: string;
      phq9_answers: number[];
      gad7_answers: number[];
      pss_answers: number[];
    };
  }) {
    const { userId, conversationId, reason, analysis } = params;

    const exists = await this.qModel.findOne({
      userId,
      conversationId,
      status: 'draft',
    });
    if (exists) return exists;

    // 트랜잭션 시작
    // const session = await this.connection.startSession();
    // session.startTransaction();
    try {
      const questionnaire = new this.qModel({
        userId,
        conversationId,
        reason,
        summary: analysis.summary,
        status: 'draft',
        generatedAt: new Date(),
      });

      const phq9 = new this.phq9Model({
        questionnaireId: questionnaire._id,
        answers: analysis.phq9_answers,
        totalScore: calcTotalScore(analysis.phq9_answers),
      });
      const gad7 = new this.gad7Model({
        questionnaireId: questionnaire._id,
        answers: analysis.gad7_answers,
        totalScore: calcTotalScore(analysis.gad7_answers),
      });
      const pss = new this.pssModel({
        questionnaireId: questionnaire._id,
        answers: analysis.pss_answers,
        totalScore: calcTotalScore(analysis.pss_answers),
      });

      questionnaire.phq9 = phq9._id;
      questionnaire.gad7 = gad7._id;
      questionnaire.pss = pss._id;

      // 세션을 사용하여 모든 문서를 저장
      await Promise.all([
        questionnaire.save({}),
        phq9.save({}),
        gad7.save({}),
        pss.save({}),
      ]);

      //await session.commitTransaction(); // 모든 작업 성공 시 최종 반영
      return questionnaire;
    } catch (error) {
      //await session.abortTransaction(); // 중간에 오류 발생 시 모든 작업 롤백
      throw error;
    } finally {
      //session.endSession(); // 세션 종료
    }
  }

  // async submit(
  //   userId: string,
  //   id: string,
  //   payload: { answers: number[]; summary?: string },
  // ) {
  //   const _id = new Types.ObjectId(id);
  //   const doc = await this.qModel.findById(_id);
  //   if (!doc) throw new NotFoundException('survey not found');
  //   if (doc.userId !== userId) throw new ForbiddenException('not owner');
  //   if (!isValidAnswers(payload.answers))
  //     throw new BadRequestException('answers must be int[9] in 0..3');

  //   doc.answers = payload.answers;
  //   doc.totalScore = calcTotalScore(payload.answers);
  //   doc.summary = payload.summary ?? '';
  //   doc.status = QuestionnaireStatus.Submitted;
  //   doc.submittedAt = new Date();
  //   return doc.save();
  // }

  listMine(userId: string, limit = 20) {
    return this.qModel
      .find({ userId: userId })
      .sort({ createdAt: -1 })
      .limit(limit);
  }

  async findByIdForOwner(userId: string, id: string) {
    const doc = await this.qModel
      .findById(id)
      .populate(['phq9', 'gad7', 'pss']);
    if (!doc) throw new NotFoundException();
    if (doc.userId !== userId) throw new ForbiddenException();
    return doc;
  }

  async deleteForOwner(userId: string, id: string): Promise<void> {
    try {
      const doc = await this.qModel.findById(id); // .session(session) 제거
      if (!doc) throw new NotFoundException();
      if (doc.userId !== userId) throw new ForbiddenException();

      await Promise.all([
        this.phq9Model.deleteOne({ _id: doc.phq9 }),
        this.gad7Model.deleteOne({ _id: doc.gad7 }),
        this.pssModel.deleteOne({ _id: doc.pss }),
        this.qModel.deleteOne({ _id: new Types.ObjectId(id) }),
      ]);

      // await session.commitTransaction();
    } catch(error) {
      // await session.abortTransaction();
      throw error;
    } finally {
      // session.endSession();
    }
  }
}
