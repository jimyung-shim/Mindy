import { Module } from '@nestjs/common';
import { McpRegistryService } from './mcp.registry';
import { McpController } from './mcp.controller';
import { PersonaToolModule } from 'src/persona/tool/persona-tool.module';

@Module({
  imports: [PersonaToolModule],
  controllers: [McpController],
  providers: [McpRegistryService],
  exports: [McpRegistryService],
})
export class McpModule {}
