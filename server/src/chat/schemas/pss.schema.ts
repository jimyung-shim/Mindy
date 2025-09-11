import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ collection: 'psss', timestamps: true })
export class Pss {
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

export const PssSchema = SchemaFactory.createForClass(Pss);
