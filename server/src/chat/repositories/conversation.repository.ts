import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Conversation } from '../schemas/conversation.schema';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ConversationRepository {
  constructor(
    @InjectModel(Conversation.name) private readonly model: Model<Conversation>,
  ) {}

  async create(userId: Types.ObjectId, title?: string) {
    const doc = await this.model.create({
      userId,
      lastMessageAt: new Date(),
      ...(title ? { title } : {}),
    } as any);
    return doc;
  }

  async findMine(userId: Types.ObjectId, limit = 20, cursor?: Date) {
    const q: any = { userId };
    if (cursor) q.lastMessageAt = { $lt: cursor };
    return this.model.find(q).sort({ lastMessageAt: -1 }).limit(limit).lean();
  }

  async touch(conversationId: Types.ObjectId) {
    await this.model.updateOne(
      { _id: conversationId },
      { $set: { lastMessageAt: new Date() }, $inc: { messageCount: 1 } },
    );
  }
}
