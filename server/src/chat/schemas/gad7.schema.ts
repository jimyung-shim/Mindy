import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ collection: 'gad7s', timestamps: true })
export class Gad7 {
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

export const Gad7Schema = SchemaFactory.createForClass(Gad7);
