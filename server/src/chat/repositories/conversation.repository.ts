import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Conversation } from '../schemas/conversation.schema';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ConversationRepository {
  constructor(
    @InjectModel(Conversation.name) private readonly model: Model<Conversation>,
  ) {}

  async create(userId: string, title?: string) {
    const doc = await this.model.create({
      userId,
      lastMessageAt: new Date(),
      ...(title ? { title } : {}),
    } as any);
    return doc;
  }

  async findMine(userId: string, limit = 20, cursor?: Date) {
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

  async deleteMine(userId: string, conversationId: Types.ObjectId) {
    await this.model.deleteOne({ _id: conversationId, userId }).exec();
  }

  async findMineById(userId: string, conversationId: Types.ObjectId) {
    return this.model.findOne({ _id: conversationId, userId }).lean();
  }
}
