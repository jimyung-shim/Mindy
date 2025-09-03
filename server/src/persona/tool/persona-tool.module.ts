import { Module } from '@nestjs/common';
import { MCP_TOOL_TOKEN } from '../../mcp/mcp.tokens';
import { PersonaService } from '../persona.service';
import { createAssignPersonaTool } from './persona-tool.provider';

@Module({
  providers: [
    PersonaService,
    {
      provide: MCP_TOOL_TOKEN,
      inject: [PersonaService],
      useFactory: (persona: PersonaService) => createAssignPersonaTool(persona),
    },
  ],
  exports: [MCP_TOOL_TOKEN],
})
export class PersonaToolModule {}
