import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtService } from '@nestjs/jwt';

// 간단화를 위해 데모용 Auth 가드 (실서비스에선 기존 HTTP JWT 가드 사용)
function userIdFromAuth(auth?: string) {
  if (!auth) return null;
  const token = auth.split(' ')[1];
  try {
    const decoded = new JwtService({ secret: process.env.JWT_SECRET! }).decode(
      token,
    ) as any;
    return decoded?.sub || decoded?.userId;
  } catch {
    return null;
  }
}

@Controller('conversations')
export class ChatController {
  constructor(private readonly chat: ChatService) {}

  @Post()
  async create(@Body() body: { title?: string }, @Query('auth') auth?: string) {
    const userId = userIdFromAuth(auth);
    const conv = await this.chat.openConversation(userId);
    return { conversationId: String(conv._id) };
  }

  @Get()
  async list(
    @Query('limit') limit = 20,
    @Query('cursor') cursor?: string,
    @Query('auth') auth?: string,
  ) {
    const userId = userIdFromAuth(auth);
    const list = await this.chat.listConversations(
      userId,
      Number(limit),
      cursor ? new Date(cursor) : undefined,
    );
    return { items: list };
  }
}
