import { z } from 'zod';

export type McpToolRun<T> = (input: T) => Promise<unknown>;

export interface McpToolProvider<T = unknown> {
  name: string;
  description: string;
  inputSchema: z.ZodType<T>; // zod 스키마
  run: McpToolRun<T>; // 실제 실행
}
