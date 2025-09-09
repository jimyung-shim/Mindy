import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, Schema as MongooseSchema } from 'mongoose';
export type QuestionnaireDocument = HydratedDocument<Questionnaire>;

const PHQ9_LEN = 9;
@Schema({ collection: 'questionnaires', timestamps: true })
export class Questionnaire {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Conversation', index: true })
  conversationId?: Types.ObjectId;

  @Prop({
    type: [Number],
    required: true,
    validate: [
      {
        validator: (a: number[]) => Array.isArray(a) && a.length === PHQ9_LEN,
        message: `answers must be ${PHQ9_LEN}`,
      },
      {
        validator: (a: number[]) =>
          a.every((v) => Number.isInteger(v) && v >= 0 && v <= 3),
        message: '0..3 only',
      },
    ],
  })
  answers!: number[];

  @Prop({ type: Number, default: 0, index: true })
  totalScore!: number;

  @Prop({ type: String })
  summary?: string;

  @Prop({
    type: String,
    enum: ['draft', 'submitted'],
    default: 'draft',
    index: true,
  })
  status!: 'draft' | 'submitted';

  @Prop({ type: Number, default: 1 })
  version?: number;

  @Prop({ type: Date })
  generatedAt?: Date;

  @Prop({ type: MongooseSchema.Types.Mixed })
  modelInfo?: Record<string, any>;
}
export const QuestionnaireSchema = SchemaFactory.createForClass(Questionnaire);
QuestionnaireSchema.index({ userId: 1, createdAt: -1 });
QuestionnaireSchema.index({ conversationId: 1, status: 1 });
QuestionnaireSchema.pre('validate', function (next) {
  if (Array.isArray((this as any).answers)) {
    (this as any).totalScore = (this as any).answers.reduce((a: number, b: number) => a + b, 0);
  }
  next();
});
