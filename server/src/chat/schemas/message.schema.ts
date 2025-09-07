import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, Schema as MongooseSchema } from 'mongoose';
export type MessageDocument = HydratedDocument<Message>;
export type MessageRole = 'user' | 'assistant' | 'system' | 'tool';

@Schema({
  collection: 'messages',
  timestamps: { createdAt: true, updatedAt: false },
})
export class Message {
  @Prop({
    type: Types.ObjectId,
    ref: 'Conversation',
    required: true,
    index: true,
  })
  conversationId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', index: true })
  userId?: Types.ObjectId;

  @Prop({ type: Number, required: true })
  seq!: number;

  @Prop({
    type: String,
    enum: ['user', 'assistant', 'system', 'tool'],
    required: true,
  })
  role!: MessageRole;

  @Prop({ type: String, required: true })
  text!: string;

  @Prop({ type: MongooseSchema.Types.Mixed })
  meta?: Record<string, any>;
}
export const MessageSchema = SchemaFactory.createForClass(Message);

MessageSchema.index({ conversationId: 1, seq: 1 }, { unique: true });
MessageSchema.index({ conversationId: 1, createdAt: 1 });

MessageSchema.pre('validate', async function (next) {
  if (this.isNew && (this as any).seq == null) {
    const last = await (this.constructor as any)
      .findOne({ conversationId: (this as any).conversationId })
      .sort({ seq: -1 })
      .select({ seq: 1 })
      .lean();
    (this as any).seq = last ? last.seq + 1 : 0;
  }
  next();
});
