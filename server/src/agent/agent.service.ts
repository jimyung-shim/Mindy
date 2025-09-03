import { Injectable } from '@nestjs/common';
import { McpRegistryService } from '../mcp/mcp.registry';

type AssignResponse = {
  personaKey: string;
  personaLabel: string;
  reason: string;
  imageUrl?: string;
};

@Injectable()
export class AgentService {
  constructor(private readonly mcp: McpRegistryService) {}

  async assignViaAgent(categories: string[]): Promise<AssignResponse> {
    // 실제로는 OpenAI Agents SDK를 써서 Hosted MCP 툴을 호출할 수 있지만,
    // 지금은 툴을 바로 실행해 동일한 payload를 얻는다.
    const tool = this.mcp.get('assign_persona');
    const input = { categories };
    const parsed = tool.inputSchema.parse(input);
    const result = (await tool.run(parsed)) as AssignResponse;
    return result;
  }
}
