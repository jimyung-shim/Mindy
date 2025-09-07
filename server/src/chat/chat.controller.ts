import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Delete,
  Param,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import type { RequestUser } from '../auth/get-user.decorator';

@UseGuards(AuthGuard('jwt'))
@Controller('conversations')
export class ChatController {
  constructor(private readonly chat: ChatService) {}

  @Post()
  async create(@Body() body: { title?: string }, @GetUser() user: RequestUser) {
    const conv = await this.chat.openConversation(user.userId, body.title);
    return { conversationId: String(conv._id) };
  }

  @Get()
  async list(
    @GetUser() user: RequestUser,
    @Query('limit') limit = 20,
    @Query('cursor') cursor?: string,
  ) {
    const list = await this.chat.listConversations(
      user.userId,
      Number(limit),
      cursor ? new Date(cursor) : undefined,
    );
    return { items: list };
  }

  @Get(':id/messages')
  getMessages(@Param('id') id: string, @GetUser() user: RequestUser) {
    // 본인 소유의 대화방인지 간단히 확인 후 메시지 반환
    return this.chat.getMessages(user.userId, id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @GetUser() user: RequestUser) {
    await this.chat.deleteConversation(user.userId, id);
    return { ok: true };
  }
}
