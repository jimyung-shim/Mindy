import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserSignupDto {
  @ApiProperty({ example: 'test@example.com' })
  @IsEmail({}, { message: '이메일 형식이 올바르지 않습니다.' })
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(8, { message: '비밀번호는 최소 8자 이상이어야 합니다.' })
  password: string;

  @ApiProperty({ example: 'mindy' })
  @IsString()
  @MinLength(2, { message: '아이디는 최소 2자 이상이어야 합니다.' })
  nickname: string;
}
