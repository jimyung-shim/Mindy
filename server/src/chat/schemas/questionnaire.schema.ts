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

  @Prop({ type: Types.ObjectId, required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, index: true })
  conversationId: Types.ObjectId;

  @Prop({
    type: [Number],
    validate: {
      validator: (arr: number[]) =>
        Array.isArray(arr) &&
        arr.length === 9 &&
        arr.every((n) => Number.isInteger(n) && n >= 0 && n <= 3),
      message: 'answers must be int[9] in 0..3',
    },
    default: undefined,
  })
  answers?: number[];

  @Prop({ type: Number, default: 0 })
  totalScore: number;

  @Prop({ type: String, default: '' })
  summary: string;

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
