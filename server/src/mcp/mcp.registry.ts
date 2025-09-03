import { Injectable, Inject, Optional } from '@nestjs/common';
import type { McpToolProvider } from './mcp.types';
import { MCP_TOOL_TOKEN } from './mcp.tokens';
import { zodToJsonSchema } from 'zod-to-json-schema';

@Injectable()
export class McpRegistryService {
  private readonly tools = new Map<string, McpToolProvider>();

  constructor(
    @Optional()
    @Inject(MCP_TOOL_TOKEN)
    tools?: McpToolProvider | McpToolProvider[],
  ) {
    const arr = !tools ? [] : Array.isArray(tools) ? tools : [tools];

    for (const t of arr) this.register(t);
  }

  register(tool: McpToolProvider) {
    if (this.tools.has(tool.name)) {
      throw new Error(`MCP tool already registered: ${tool.name}`);
    }
    this.tools.set(tool.name, tool);
  }

  list() {
    return [...this.tools.values()].map((t) => ({
      name: t.name,
      description: t.description,
      // 간단 요약(정식 MCP 스펙으로 갈 거면 JSON Schema 변환 로직 추가)
      inputSchema: zodToJsonSchema(t.inputSchema),
    }));
  }

  get(name: string) {
    const t = this.tools.get(name);
    if (!t) throw new Error(`MCP tool not found: ${name}`);
    return t;
  }
}
