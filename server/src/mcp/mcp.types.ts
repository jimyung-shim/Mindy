import { z } from 'zod';

export type McpToolRun = (input: unknown) => Promise<unknown>;

export interface McpToolProvider {
  name: string;
  description: string;
  inputSchema: z.ZodTypeAny; // zod 스키마
  run: McpToolRun; // 실제 실행
}
