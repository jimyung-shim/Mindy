import { Module } from '@nestjs/common';
import { McpRegistryService } from './mcp.registry';
import { McpController } from './mcp.controller';

@Module({
  controllers: [McpController],
  providers: [McpRegistryService],
  exports: [McpRegistryService],
})
export class McpModule {}
