import { BadRequestException, Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async signup(
    email: string,
    password: string,
    nickname: string,
  ): Promise<Omit<User, 'password'>> {
    // 1) 중복 이메일 체크
    const exists = await this.userRepository.findByEmail(email);
    if (exists) {
      throw new BadRequestException('이미 가입된 이메일입니다.');
    }

    // 2) 비밀번호 해시
    const rounds = parseInt(process.env.BCRYPT_SALT_ROUNDS ?? '12', 10);
    const hashedPassword: string = await bcrypt.hash(password, rounds);

    // 3) 저장
    const user = await this.userRepository.create({
      email,
      password: hashedPassword, // DB에 저장되는 건 password 필드
      nickname,
    });

    // 4) 비밀번호 제외 후 반환

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...safeUser } = user;
    return safeUser;
  }
}
