import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RefreshToken } from '@prisma/client';
import bcrypt from 'bcrypt';

@Injectable()
export class RefreshTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    userId: string;
    tokenHash: string;
    expiresAt: Date;
  }): Promise<RefreshToken> {
    return this.prisma.refreshToken.create({ data });
  }

  async findValidByUser(
    userId: string,
    tokenHash: string,
  ): Promise<RefreshToken | null> {
    return await this.prisma.refreshToken.findFirst({
      where: {
        userId,
        tokenHash,
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
    });
  }

  async findMatching(
    valids: RefreshToken[],
    raw: string,
  ): Promise<RefreshToken | null> {
    for (const t of valids) {
      const ok = await bcrypt.compare(raw, t.tokenHash);
      if (ok) return t;
    }
    return null;
  }

  async revoke(id: string): Promise<RefreshToken> {
    return await this.prisma.refreshToken.update({
      where: { id },
      data: { revokedAt: new Date() },
    });
  }

  async revokeAllForUser(userId: string): Promise<{ count: number }> {
    return await this.prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  async findAllValidForUser(userId: string): Promise<RefreshToken[]> {
    return await this.prisma.refreshToken.findMany({
      where: { userId, revokedAt: null, expiresAt: { gt: new Date() } },
    });
  }
}
