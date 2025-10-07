import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';
import type { RequestUser } from '../auth/get-user.decorator';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  @UseGuards(JwtAuthGuard) // 2. 이 엔드포인트를 JwtAuthGuard로 보호합니다.
  create(
    @Body() createReservationDto: CreateReservationDto,
    @GetUser() user: RequestUser, // 3. Request 객체를 받아옵니다.
  ) {
    const userId = user.userId; // 4. req.user에서 실제 사용자 ID를 추출합니다.
    return this.reservationsService.create(createReservationDto, userId);
  }
}
