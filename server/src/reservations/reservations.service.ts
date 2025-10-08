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

  // 로그인한 사용자의 모든 예약 목록을 조회
  findAllForUser(userId: string) {
    return this.prisma.reservation.findMany({
      where: {
        userId: userId, // 전달받은 userId와 일치하는 예약만 조회
      },
      orderBy: {
        reservationAt: 'desc', // 예약 날짜를 기준으로 최신순으로 정렬
      },
      // 관계를 맺고 있는 Counselor(상담사) 정보를 함께 가져오도록 설정
      include: {
        counselor: {
          select: { // 필요한 상담사 정보만 선택적으로 포함
            name: true,
            title: true,
          },
        },
      },
    });
  }
}
