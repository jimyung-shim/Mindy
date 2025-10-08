import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';
import type { RequestUser } from '../auth/get-user.decorator';

@Controller('reservations')
@UseGuards(JwtAuthGuard)
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  create(
    @Body() createReservationDto: CreateReservationDto,
    @GetUser() user: RequestUser, // 3. Request 객체를 받아옵니다.
  ) {
    const userId = user.userId; // 4. req.user에서 실제 사용자 ID를 추출합니다.
    return this.reservationsService.create(createReservationDto, userId);
  }

  @Get('me')
  findMyReservations(@GetUser() user: RequestUser) {
    console.log('--- [DEBUG] Reservations Controller ---');
    console.log('User from @GetUser():', user);
    console.log('-----------------------------------');
    // 현재 로그인한 사용자의 ID를 서비스 메소드로 전달
    return this.reservationsService.findAllForUser(user.userId);
  }
}
