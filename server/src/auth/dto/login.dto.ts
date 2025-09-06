import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ description: '사용자 이메일', example: 'test@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ description: '비밀번호(8자 이상)', example: 'password123' })
  @IsString()
  @MinLength(8)
  password!: string;
}
