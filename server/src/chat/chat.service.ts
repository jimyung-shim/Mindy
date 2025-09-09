import { Injectable, Logger } from '@nestjs/common';
import { Types } from 'mongoose';
import { ConversationRepository } from './repositories/conversation.repository';
import { MessageRepository } from './repositories/message.repository';
import { LlmService } from './llm.service';
import type { StreamHandle } from './types/chat.types';
import type { PersonaKey } from '../persona/persona.types';
import { getSystemPromptForPersona } from 'src/persona/personaPrompts';
import { PersonaService } from 'src/persona/persona.service';
// 스트림 청크 타입(선택: 파일에 두고 재사용해도 됨)
type StreamChunk =
  | { delta: string; done: false; serverMsgSeq: number }
  | { done: true; text: string; serverMsgId: string };

@Injectable()
export class ChatService {
  private readonly log = new Logger(ChatService.name);
  // socketId → conversationId → stream handle
  private readonly running = new Map<string, Map<string, StreamHandle>>();

  constructor(
    private readonly conversationRepository: ConversationRepository,
    private readonly messageRepository: MessageRepository,
    private readonly llmService: LlmService,
    private readonly personaService: PersonaService,
  ) {}

  async openConversation(
    userId: string,
    personaKey?: PersonaKey,
    title?: string,
  ) {
    const conv = await this.conversationRepository.create(
      userId,
      personaKey,
      title,
    );
    return conv;
  }

  async listConversations(userId: string, limit = 20, cursor?: Date) {
    return this.conversationRepository.findMine(userId, limit, cursor);
  }

  // ⬇⬇⬇ 여기 시그니처가 핵심: async * 로 변경, 반환 타입도 AsyncGenerator 로 명시
  async *createUserMessage(
    socketId: string,
    userId: string,
    conversationId: string,
    clientMsgId: string,
    text: string,
    system?: string,
  ): AsyncGenerator<StreamChunk, void, void> {
    const convId = new Types.ObjectId(conversationId);

    // 1) 유저 메시지 저장 + 카운트/타임스탬프 갱신
    const userMsg = await this.messageRepository.appendUserMessage(
      convId,
      userId,
      clientMsgId,
      text,
    );
    await this.conversationRepository.touch(convId);

    // 2) 스트리밍 컨트롤러 등록
    const controller = new AbortController();
    const handle: StreamHandle = { controller };
    this.ensureSocketMap(socketId).set(conversationId, handle);

    let assembled = '';

    try {
      const conversation = await this.conversationRepository.findMineById(
        userId,
        convId,
      );
      const systemPrompt = this.personaService.getSystemPrompt(
        conversation?.personaKey,
      );
      // 3) LLM 스트림 델타 전송
      for await (const delta of this.llmService.streamChat(
        text,
        systemPrompt,
        controller.signal,
      )) {
        assembled += delta;
        yield { delta, done: false, serverMsgSeq: userMsg.seq + 1 };
      }

      // 4) 보조응답 저장 + 최종 청크
      const assistant = await this.messageRepository.appendAssistantMessage(
        convId,
        assembled,
        { usage: {} },
      );
      await this.conversationRepository.touch(convId);

      yield { done: true, text: assembled, serverMsgId: String(assistant._id) };
    } finally {
      // 5) 자원 정리(취소/에러/정상완료 모두에서)
      this.ensureSocketMap(socketId).delete(conversationId);
      if (this.running.get(socketId)?.size === 0) {
        this.running.delete(socketId);
      }
    }
  }

  cancel(socketId: string, conversationId: string) {
    const map = this.running.get(socketId);
    const handle = map?.get(conversationId);
    if (handle) {
      handle.controller.abort();
      map!.delete(conversationId);
      return true;
    }
    return false;
  }

  private ensureSocketMap(socketId: string) {
    if (!this.running.has(socketId)) this.running.set(socketId, new Map());
    return this.running.get(socketId)!;
  }

  async deleteConversation(userId: string, conversationId: string) {
    const _id = new Types.ObjectId(conversationId);
    // 1) 메시지 먼저 삭제
    await this.messageRepository.deleteByConversation(_id);
    // 2) 본인 소유의 대화방만 삭제
    await this.conversationRepository.deleteMine(userId, _id);
    return { ok: true };
  }

  async getMessages(userId: string, conversationId: string) {
    const convId = new Types.ObjectId(conversationId);
    // 본인 소유 대화방이 맞는지 확인
    const conv = await this.conversationRepository.findMineById(userId, convId);
    if (!conv) {
      throw new Error('Conversation not found or access denied');
    }
    return this.messageRepository.list(convId, 100); // 최근 100개 메시지
  }
}
