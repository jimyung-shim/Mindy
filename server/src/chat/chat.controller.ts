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

  @Delete(':id')
  async remove(@Param('id') id: string, @GetUser() user: RequestUser) {
    await this.chat.deleteConversation(user.userId, id);
    return { ok: true };
  }
}
