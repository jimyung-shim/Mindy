import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshDto {
  @ApiProperty({ description: '유저 ID', example: 'uuid-string' })
  @IsString()
  @IsNotEmpty()
  userId!: string;

  @ApiProperty({ description: '리프레시 토큰(원문)', example: 'rft_...' })
  @IsString()
  @IsNotEmpty()
  refreshToken!: string;
}
