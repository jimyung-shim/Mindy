import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ collection: 'phq9s', timestamps: true })
export class Phq9 {
  _id: Types.ObjectId;
  @Prop({
    type: Types.ObjectId,
    ref: 'Questionnaire',
    required: true,
    index: true,
  })
  questionnaireId: Types.ObjectId;
  @Prop({ type: [Number], required: true })
  answers: number[];
  @Prop({ type: Number, required: true })
  totalScore: number;
}

export const Phq9Schema = SchemaFactory.createForClass(Phq9);
