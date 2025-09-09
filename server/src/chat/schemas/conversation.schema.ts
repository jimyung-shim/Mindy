import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import type { PersonaKey } from '../../persona/persona.types';
export type ConversationDocument = HydratedDocument<Conversation>;

@Schema({ collection: 'conversations', timestamps: true })
export class Conversation {
  @Prop({ type: String, required: true, index: true })
  userId!: string;

  @Prop({ type: String, index: true }) // [!] 이 Prop 추가
  personaKey?: PersonaKey;

  @Prop({ type: Number, default: 0 })
  messageCount!: number;

  @Prop({ type: Date, default: () => new Date() })
  startedAt!: Date;

  @Prop({ type: Date, default: () => new Date(), index: true })
  lastMessageAt!: Date;

  @Prop({ type: String })
  summary?: string;

  @Prop({ type: Boolean, default: false })
  surveyTriggered?: boolean;
}
export const ConversationSchema = SchemaFactory.createForClass(Conversation);
ConversationSchema.index({ userId: 1, lastMessageAt: -1 });
