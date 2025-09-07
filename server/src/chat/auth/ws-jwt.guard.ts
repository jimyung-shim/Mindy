import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class WsJwtGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const client = context.switchToWs().getClient();
    // socket.io: handshake.auth.token 또는 headers.authorization 사용
    const token =
      client.handshake?.auth?.token ||
      client.handshake?.headers?.authorization?.split(' ')[1];
    if (!token) throw new UnauthorizedException('NO_TOKEN');
    try {
      const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as any;
      client.user = { userId: payload.sub || payload.userId };
      return true;
    } catch {
      throw new UnauthorizedException('INVALID_TOKEN');
    }
  }
}
