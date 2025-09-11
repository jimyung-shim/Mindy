import { Injectable, Logger, Inject, forwardRef } from '@nestjs/common';
import { SurveyService } from './survey.service';
import { TriggerReason } from '../chat/schemas/questionnaire.schema';
import { ChatGateway } from '../chat/chat.gateway';
import { RiskClassifierService } from '../risk/risk.classifier.service';

const recentTriggerByConv = new Map<string, number>();
const MIN_COOLDOWN_MS = 90_000;

@Injectable()
export class SurveyTriggerService {
  private readonly logger = new Logger(SurveyTriggerService.name);

  constructor(
    private readonly surveyService: SurveyService,
    @Inject(forwardRef(() => ChatGateway))
    private readonly chatGateway: ChatGateway,
    private readonly riskClassifierService: RiskClassifierService,
  ) {}

  async onMessageCreated(ev: {
    userId: string;
    conversationId: string;
    messageCount: number;
    text?: string;
    riskLevel?: 'none' | 'low' | 'moderate' | 'high';
    recentMessages?: Array<{ role: 'user' | 'assistant'; content: string }>;
  }) {
    const now = Date.now();
    const last = recentTriggerByConv.get(ev.conversationId) ?? 0;
    if (now - last < MIN_COOLDOWN_MS) return;

    const cls = await this.riskClassifierService.classify({
      text: ev.text ?? '',
      recentMessages: ev.recentMessages?.slice(-10),
    });

    const shouldByTurns = ev.messageCount >= 30;
    const shouldByRisk = cls.level === 'moderate' || cls.level === 'high';
    if (!shouldByTurns && !shouldByRisk) return;

    const analysis = await this.surveyService.analyzeLogForSurvey(
      ev.conversationId,
    );

    const reason = shouldByRisk ? TriggerReason.Risk : TriggerReason.Turns;

    const draft = await this.surveyService.createDraft({
      userId: ev.userId,
      conversationId: ev.conversationId,
      reason,
      analysis,
    });

    recentTriggerByConv.set(ev.conversationId, now);
    this.logger.log(
      `Survey draft ready: ${draft._id} (reason=${reason}, risk=${cls.level})`,
    );

    this.chatGateway.emitSurveyPrompt(ev.userId, {
      conversationId: ev.conversationId,
      reason: reason === TriggerReason.Risk ? 'risk' : 'turns',
      draftId: draft._id.toString(),
    });
  }
}
