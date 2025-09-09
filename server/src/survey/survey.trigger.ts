import { Injectable, Logger } from '@nestjs/common';
import { SurveyService } from './survey.service';
import { TriggerReason } from '../chat/schemas/questionnaire.schema';
import { ChatGateway } from '../chat/chat.gateway';

const recentTriggerByConv = new Map<string, number>();
const MIN_COOLDOWN_MS = 90_000;

@Injectable()
export class SurveyTriggerService {
  private readonly logger = new Logger(SurveyTriggerService.name);

  constructor(
    private readonly survey: SurveyService,
    private readonly chatGateway: ChatGateway,
  ) {}

  async onMessageCreated(ev: {
    userId: string;
    conversationId: string;
    messageCount: number;
    riskLevel?: 'none' | 'low' | 'moderate' | 'high';
  }) {
    const now = Date.now();
    const last = recentTriggerByConv.get(ev.conversationId) ?? 0;
    if (now - last < MIN_COOLDOWN_MS) return;

    const shouldByTurns = ev.messageCount >= 30;
    const shouldByRisk = ev.riskLevel === 'moderate' || ev.riskLevel === 'high';
    if (!shouldByTurns && !shouldByRisk) return;

    const reason: TriggerReason = shouldByRisk
      ? TriggerReason.Risk
      : TriggerReason.Turns;

    const draft = await this.survey.createDraft({
      userId: ev.userId,
      conversationId: ev.conversationId,
      reason,
    });

    recentTriggerByConv.set(ev.conversationId, now);
    this.logger.log(`Survey draft ready: ${draft._id} (reason=${reason})`);

    this.chatGateway.emitSurveyPrompt(ev.userId, {
      conversationId: ev.conversationId,
      reason: reason === TriggerReason.Risk ? 'risk' : 'turns',
      draftId: draft._id.toString(),
    });
  }
}
