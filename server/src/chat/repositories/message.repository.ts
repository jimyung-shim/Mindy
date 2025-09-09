import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Injectable, ConflictException } from '@nestjs/common';
import { Message } from '../schemas/message.schema';

@Injectable()
export class MessageRepository {
  constructor(
    @InjectModel(Message.name) private readonly model: Model<Message>,
  ) {}

  async appendUserMessage(
    conversationId: Types.ObjectId,
    userId: string,
    clientMsgId: string,
    text: string,
  ) {
    try {
      // clientMsgId는 meta에 저장하여 멱등 조회에 활용 (unique idx를 별도 컬렉션으로 둬도 OK)
      const created = await this.model.create({
        conversationId,
        userId,
        role: 'user',
        text,
        meta: { clientMsgId },
      } as any);
      return created;
    } catch (e: any) {
      if (e?.code === 11000) {
        throw new ConflictException('DUPLICATE_MESSAGE');
      }
      throw e;
    }
  }

  async appendAssistantMessage(
    conversationId: Types.ObjectId,
    text: string,
    meta?: Record<string, any>,
  ) {
    const created = await this.model.create({
      conversationId,
      role: 'assistant',
      text,
      meta,
    } as any);
    return created;
  }

  async list(conversationId: Types.ObjectId, limit = 50, afterSeq?: number) {
    const q: any = { conversationId };
    if (afterSeq != null) q.seq = { $gt: afterSeq };
    return this.model.find(q).sort({ seq: 1 }).limit(limit).lean();
  }

  async deleteByConversation(conversationId: Types.ObjectId) {
    await this.model.deleteMany({ conversationId }).exec();
  }
}
