import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { UseGuards, UnauthorizedException } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { WsJwtGuard } from './auth/ws-jwt.guard';
import { CreateMessageDto } from './dto/create-message.dto';

@WebSocketGateway({
  cors: { origin: true, credentials: true },
})
@UseGuards(WsJwtGuard)
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer() server!: Server;
  constructor(private readonly chat: ChatService) {}

  handleConnection(client: Socket) {
    // ping/pong은 socket.io 기본 제공
  }

  @SubscribeMessage('message:create')
  async onCreate(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: CreateMessageDto,
  ) {
    const userId = client.user?.userId;
    if (!userId) throw new UnauthorizedException('NO_USER_IN_SOCKET');

    let { conversationId, clientMsgId, text } = body;

    if (conversationId === 'new') {
      const newConv = await this.chat.openConversation(userId);
      conversationId = String(newConv._id); // 실제 ID로 교체
      // 클라이언트에게도 새로 생성된 ID를 알려줍니다.
      client.emit('conversation:created', {
        tempId: 'new',
        newId: conversationId,
      });
    }

    // ack (선점)
    client.emit('message:ack', { conversationId, clientMsgId });

    try {
      const stream = this.chat.createUserMessage(
        client.id,
        userId,
        conversationId,
        clientMsgId,
        text,
      );
      for await (const chunk of stream) {
        if (!chunk.done) {
          client.emit('message:stream', {
            conversationId,
            delta: chunk.delta,
            done: false,
          });
        } else {
          client.emit('message:complete', {
            conversationId,
            text: chunk.text,
            done: true,
            serverMsgId: chunk.serverMsgId,
          });
        }
      }
    } catch (e: any) {
      if (e?.name === 'AbortError') {
        client.emit('message:error', {
          conversationId,
          clientMsgId,
          code: 'CANCELLED',
          message: 'Request cancelled',
        });
        return;
      }
      client.emit('message:error', {
        conversationId,
        clientMsgId,
        code: 'OPENAI_ERROR',
        message: e?.message ?? 'LLM error',
      });
    }
  }

  @SubscribeMessage('message:cancel')
  onCancel(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { conversationId: string },
  ) {
    const ok = this.chat.cancel(client.id, payload.conversationId);
    client.emit('message:cancelled', {
      conversationId: payload.conversationId,
      ok,
    });
  }
}
