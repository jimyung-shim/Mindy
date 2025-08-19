import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UserSignupDto } from './dto/signup.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /** POST /users/signup */
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() dto: UserSignupDto) {
    const { email, password, nickname } = dto;
    const user = await this.userService.signup(email, password, nickname);
    // 여기서는 토큰 없이 생성 결과만 반환 (id, email, nickname, createdAt)
    return user;
  }
}
