// server/src/chat/schemas/questionnaire.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type QuestionnaireDocument = HydratedDocument<Questionnaire>;

export enum QuestionnaireStatus {
  Draft = 'draft',
  Submitted = 'submitted',
}

export enum TriggerReason {
  Risk = 'risk',
  Turns = 'turns',
}

@Schema({ timestamps: true, collection: 'questionnaires' })
export class Questionnaire {
  _id: Types.ObjectId;

  @Prop({ type: String, required: true, index: true })
  userId: string;

  @Prop({ type: String, required: true, index: true })
  conversationId: string;

  @Prop({ type: String, default: '' })
  summary: string;

  @Prop({ type: Types.ObjectId, ref: 'Phq9' })
  phq9?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Gad7' })
  gad7?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Pss' })
  pss?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Cbt' })
  cbt?: Types.ObjectId;

  @Prop({
    type: String,
    enum: QuestionnaireStatus,
    default: QuestionnaireStatus.Draft,
    index: true,
  })
  status: QuestionnaireStatus;

  @Prop({ type: String, enum: TriggerReason, required: true, index: true })
  reason: TriggerReason;

  @Prop({ type: Date })
  generatedAt: Date;

  @Prop({ type: Date })
  submittedAt?: Date;

  @Prop({ type: Object })
  modelInfo?: { model: string; promptVer: string };
}

export const QuestionnaireSchema = SchemaFactory.createForClass(Questionnaire);

// helpful compound indexes
QuestionnaireSchema.index({ userId: 1, createdAt: -1 });
QuestionnaireSchema.index({ conversationId: 1, status: 1 });
