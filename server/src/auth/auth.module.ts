import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { UserRepository } from 'src/user/user.repository';
import { RefreshTokenRepository } from './refresh-token.repository';
@Module({
  imports: [
    UserModule, // 유저 조회/검증을 위해
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET || 'a3d8hm58sdf3vm4sf3tyu4dfs2s6d',
      signOptions: { expiresIn: process.env.JWT_ACCESS_SECRET || '10m' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserRepository, RefreshTokenRepository],
  exports: [AuthService],
})
export class AuthModule {}
