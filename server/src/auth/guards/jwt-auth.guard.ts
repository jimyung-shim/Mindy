import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any) {
    // 이 로그는 API가 호출될 때마다 서버 터미널에 출력됩니다.
    console.log('--- [DEBUG] JWT Auth Guard ---');
    console.log('Error:', err);
    console.log('User Payload from Strategy:', user);
    console.log('Info / Token Error:', info);
    console.log('------------------------------');

    if (err || !user) {
      // 에러가 있거나 user 객체가 없으면 예외를 발생시킵니다.
      throw err || new UnauthorizedException('인증 가드에서 실패했습니다.');
    }
    return user;
  }
}
