import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { UserRepository } from 'src/user/user.repository';
import { RefreshTokenRepository } from './refresh-token.repository';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UserRepository,
    private readonly jwt: JwtService,
    private readonly refreshTokens: RefreshTokenRepository,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.users.findByEmail(email);

    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return null;

    return user;
  }

  private async issueTokens(user: Pick<User, 'id' | 'email' | 'nickname'>) {
    // access 토큰 발급
    const accessToken = await this.jwt.signAsync(
      { sub: user.id, email: user.email },
      {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m',
      },
    );
    //refresh 토큰 발급
    const rawRefresh = crypto.randomBytes(64).toString('base64url');
    const tokenHash = await bcrypt.hash(rawRefresh, 12);
    const expDays = process.env.JWT_REFRESH_EXPIRES
      ? parseInt(process.env.JWT_REFRESH_EXPIRES, 10)
      : 7;
    await this.refreshTokens.create({
      userId: user.id,
      tokenHash,
      expiresAt: new Date(Date.now() + expDays * 24 * 60 * 60 * 60 * 1000),
    });

    return {
      accessToken,
      refreshToken: rawRefresh,
      userId: user.id,
      nickname: user.nickname,
    };
  }

  // 로그인
  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.issueTokens(user);
  }

  //로그아웃
  async logout(userId: string) {
    await this.refreshTokens.revokeAllForUser(userId);
    return { ok: true };
  }
}
