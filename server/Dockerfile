# ----------------- STAGE 1: 빌드 환경 -----------------
FROM node:20-alpine AS builder

WORKDIR /app

# package.json 파일을 먼저 복사하여 종속성 설치 캐싱 활용
COPY package*.json ./

# 개발용을 포함한 모든 종속성 설치
RUN npm install

# Prisma 타입을 먼저 생성해야 TypeScript 빌드가 성공합니다.
# Prisma 스키마 파일을 복사합니다.
COPY prisma ./prisma/
# Prisma 클라이언트(타입)를 생성합니다.
RUN npx prisma generate

# 나머지 모든 소스코드 복사
COPY . .

# 애플리케이션 빌드 (dist 폴더 생성)
RUN npm run build


# ----------------- STAGE 2: 최종 운영 환경 -----------------
FROM node:20-alpine

WORKDIR /app

# 빌드 단계에서 생성된 필수 파일들만 복사합니다.
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

# package.json에 정의된 start:prod 스크립트를 사용합니다.
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:prod"]