import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // 1. PrismaService import 추가
import { Counselor } from '@prisma/client'; // 2. Counselor 타입 import 추가

@Injectable()
export class CounselorsService {
  constructor(private prisma: PrismaService) {}

  findAll(): Promise<Counselor[]> {
    return this.prisma.counselor.findMany();
  }
  findOne(id: string): Promise<Counselor | null> {
    return this.prisma.counselor.findUnique({
      where: { id },
    });
  }
}
