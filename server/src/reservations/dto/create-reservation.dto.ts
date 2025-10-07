// src/reservations/dto/create-reservation.dto.ts
import { IsString, IsDate, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ReservationLocation } from '@prisma/client';

export class CreateReservationDto {
  @IsString()
  counselorId: string;

  @Type(() => Date)
  @IsDate()
  reservationAt: Date;

  @IsEnum(ReservationLocation)
  location: ReservationLocation;
}
