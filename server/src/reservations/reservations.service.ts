import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReservationDto } from './dto/create-reservation.dto';

@Injectable()
export class ReservationsService {
  constructor(private prisma: PrismaService) {}

  create(createReservationDto: CreateReservationDto, userId: string) {
    return this.prisma.reservation.create({
      data: {
        ...createReservationDto,
        userId: userId, // 나중에 실제 인증된 사용자 ID를 받아와야 합니다.
      },
    });
  }
}
