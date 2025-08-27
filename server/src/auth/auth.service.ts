import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { UserRepository } from 'src/user/user.repository';
import { RefreshTokenRepository } from './refresh-token.repository';
import { User } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwt: JwtService,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly cfg: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) return null;
    if (!user.password) return null;

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return null;

    return user;
  }

  // 토큰, 닉네임 반환
  private async issueTokens(user: Pick<User, 'id' | 'email' | 'nickname'>) {
    // access 토큰 발급
    const accessToken = await this.jwt.signAsync({
      sub: user.id,
      email: user.email,
    });

    //refresh 토큰 발급
    const rawRefresh = crypto.randomBytes(64).toString('base64url');
    const tokenHash = await bcrypt.hash(rawRefresh, 12);

    const expDays = this.cfg.get<number>('JWT_REFRESH_EXPIRES_DAYS', 7);
    const expiresAt = new Date(Date.now() + expDays * 24 * 60 * 60 * 1000);

    await this.refreshTokenRepository.create({
      userId: user.id,
      tokenHash,
      expiresAt,
    });

    return {
      accessToken,
      refreshToken: rawRefresh,
      userId: user.id,
      nickname: user.nickname,
    };
  }

  async refresh(userId: string, rawRefresh: string) {
    // 1) 유효한 토큰들 가져와서 bcrypt.compare로 매칭 (직접 equality 금지)
    const valids =
      await this.refreshTokenRepository.findAllValidForUser(userId);
    const hit = await this.refreshTokenRepository.findMatching(
      valids,
      rawRefresh,
    );
    if (!hit) throw new UnauthorizedException('Invalid refresh token');

    // 2) 사용된 리프레시 토큰은 즉시 회수 (회전)
    await this.refreshTokenRepository.revoke(hit.id);

    // 3) 새 토큰 재발급
    const user = await this.userRepository.findById(userId);
    if (!user) throw new UnauthorizedException();
    return this.issueTokens(user);
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
    await this.refreshTokenRepository.revokeAllForUser(userId);
    return { ok: true };
  }
}
