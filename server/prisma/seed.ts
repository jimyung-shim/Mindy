import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 예시 데이터
const COUNSELORS_DATA = [
  {
    name: '오윤희 상담가',
    title: '심리상담 전문가',
    bio: '해결하기 어려운 문제들을 풀어가며 아픔을 함께 극복합니다.',
    tags: ['#우울', '#조울', '#불안', '#대인관계', '#커플갈등', '#부적응'],
    imageUrl: '/public/counselors/counselor1.png',
  },
  {
    name: '박은정 상담가',
    title: '마음치유 전문가',
    bio: '용서는 나를 위해 하는 것. 내 안에서 빠져나와 삶 속으로 걸어가세요.',
    tags: ['#공황장애', '#연예인 멘탈관리', '#부부갈등', '#가족상담'],
    imageUrl: '/public/counselors/counselor2.png',
  },
  {
    name: '김성균 상담가',
    title: '가족상담 전문가',
    bio: '당신의 Heartwarmer가 기다리고 있습니다.',
    tags: ['#양육코칭', '#부모상담', '#커플', '#연애', '#가족상담'],
    imageUrl: '/public/counselors/counselor3.png',
  },
];

async function main() {
  try {
    console.log(`Start seeding ...`);
    await prisma.counselor.createMany({
      data: COUNSELORS_DATA,
      skipDuplicates: true,
    });
    console.log(`Seeding finished.`);
  } catch (e) {
    // 에러가 발생하면 여기서 처리
    console.error(e);
    process.exit(1);
  } finally {
    // 성공하든 실패하든 항상 실행되어 DB 연결을 끊어줌
    await prisma.$disconnect();
    console.log('Database connection closed.');
  }
}

// main 함수를 호출
main().catch((e) => {
  console.error('Unhandled error in main:', e);
  process.exit(1);
});
