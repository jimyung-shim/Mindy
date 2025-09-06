import {
  Controller,
  Body,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { McpRegistryService } from './mcp.registry';
import { z } from 'zod';

@Controller('mcp')
export class McpController {
  constructor(private readonly registry: McpRegistryService) {}

  @Get('tools')
  listTools() {
    return this.registry.list();
  }

  @Post('tools/:name/invoke')
  @HttpCode(HttpStatus.OK)
  async invoke(@Param('name') name: string, @Body() input: unknown) {
    const tool = this.registry.get(name);
    // 런타임 입력 검증
    type InputType = z.infer<typeof tool.inputSchema>;
    const parsed: InputType = tool.inputSchema.parse(input);

    const result = await tool.run(parsed);
    return { ok: true, result };
  }
}
