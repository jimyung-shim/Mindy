# ----------------- STAGE 1: Build aplication -----------------
FROM node:20-alpine AS builder

# 작업 디렉토리 설정
WORKDIR /app

# Prisma 스키마와 package.json 파일을 먼저 복사하여 종속성 캐싱 활용
COPY prisma ./prisma/
COPY package*.json ./

# 모든 종속성 설치 (dev 포함, 빌드 및 prisma generate에 필요)
RUN npm install

# Prisma 클라이언트 생성
RUN npx prisma generate

# 나머지 소스 코드 복사
COPY . .

# 애플리케이션 빌드
RUN npm run build

# ----------------- STAGE 2: Production image -----------------
FROM node:20-alpine AS runner

# 작업 디렉토리 설정
WORKDIR /app

# 프로덕션용 종속성만 설치하기 위해 package.json 복사
COPY package*.json ./
RUN npm install --only=production

# 빌드 스테이지에서 빌드된 결과물과 필요 파일들만 복사
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
# 생성된 Prisma 클라이언트 복사
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# 애플리케이션이 3000번 포트를 사용
EXPOSE 3000

# 컨테이너 실행 시 Prisma 마이그레이션을 적용하고 서버를 시작
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main.js"]