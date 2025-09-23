import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ collection: 'cbts', timestamps: true })
export class Cbt {
  _id: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Questionnaire',
    required: true,
    index: true,
  })
  questionnaireId: Types.ObjectId;

  @Prop({ type: String })
  situation: string;

  @Prop({
    type: { name: String, intensity: Number },
    default: { name: '', intensity: 0 },
  })
  emotion: { name: string; intensity: number };

  @Prop({ type: String })
  automaticThought: string;

  @Prop({ type: [String], default: [] })
  supportingEvidence: string[];

  @Prop({ type: [String], default: [] })
  counterEvidence: string[];

  @Prop({ type: [String], default: [] })
  alternativeThoughts: string[];

  @Prop({
    type: { name: String, intensity: Number },
    default: { name: '', intensity: 0 },
  })
  emotionAfterAlternative: { name: string; intensity: number };
}

export const CbtSchema = SchemaFactory.createForClass(Cbt);

export type CbtDocument = HydratedDocument<Cbt>;
