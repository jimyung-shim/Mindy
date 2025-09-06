import {
  Controller,
  Body,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AssignPersonaDto } from './dto/assign.dto';
import { AgentService } from '../agent/agent.service';

@Controller('persona')
export class PersonaController {
  constructor(private readonly agent: AgentService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('assign')
  @HttpCode(HttpStatus.OK)
  async assign(@Body() dto: AssignPersonaDto) {
    // 실제 구현은 OpenAI Agents SDK 경유 MCP 호출 예정.
    // 현재는 레지스트리의 assign_persona 툴을 직접 실행하는 AgentService를 통해 결과를 반환.
    const result = await this.agent.assign(dto.categories);
    return result;
  }
}
