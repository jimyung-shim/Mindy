import { Module } from '@nestjs/common';
import { CounselorsController } from './counselors.controller';
import { CounselorsService } from './counselors.service';
import { PrismaModule } from '../prisma/prisma.module'; // 1. PrismaModule import 추가

@Module({
  imports: [PrismaModule], // 2. imports 배열에 PrismaModule 추가
  controllers: [CounselorsController],
  providers: [CounselorsService],
})
export class CounselorsModule {}
