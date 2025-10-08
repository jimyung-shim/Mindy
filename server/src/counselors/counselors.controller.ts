import { Controller, Get, Param } from '@nestjs/common';
import { CounselorsService } from './counselors.service';
import { Counselor } from '@prisma/client'; // 1. Counselor 타입 import 추가

@Controller('counselors')
export class CounselorsController {
  constructor(private readonly counselorsService: CounselorsService) {}

  @Get()
  findAll(): Promise<Counselor[]> {
    return this.counselorsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Counselor | null> {
    return this.counselorsService.findOne(id);
  }
}
