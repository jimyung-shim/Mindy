import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Get,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { UserSignupDto } from './dto/signup.dto';
import { GetUser } from 'src/auth/get-user.decorator';
import type { RequestUser } from 'src/auth/get-user.decorator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 회원가입 요청
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '회원가입' })
  @ApiResponse({ status: 201, description: '유저 생성 성공' })
  async signup(@Body() dto: UserSignupDto) {
    const { email, password, nickname } = dto;
    const user = await this.userService.signup(email, password, nickname);
    // 여기서는 토큰 없이 생성 결과만 반환 (id, email, nickname, createdAt)
    return user;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: '내 정보 조회' })
  getMe(@GetUser() user: RequestUser | undefined) {
    if (!user) {
      return { userId: null, email: null };
    }
    return { userId: user.userId, email: user.email };
  }
}
