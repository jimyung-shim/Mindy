

# 🐱 MINDY (마인디) - AI 챗봇 & 인턴 상담사 연계 심리상담 플랫폼

![Project Status](https://img.shields.io/badge/Status-Development-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![Tech Stack](https://img.shields.io/badge/Stack-React%20Native%20%7C%20NestJS-orange)

> **제13회 K-해커톤 결선 진출작 (1분과 - 충청권)** > **팀명:** Meow (충북대학교 컴퓨터공학과)

**MINDY**는 높은 상담 비용과 심리적 장벽으로 인해 상담을 망설이는 내담자와, 수련 기회가 필요한 인턴 상담사를 연결하는 **저비용 심리 상담 애플리케이션**입니다. 생성형 AI 기술을 활용하여 초기 라포 형성을 돕고 문진표를 자동화하여 상담의 효율성을 극대화합니다.

---

## 📖 목차
1. [프로젝트 소개](#-프로젝트-소개)
2. [주요 기능](#-주요-기능)
3. [기술 스택](#-기술-스택)
4. [시스템 아키텍처](#-시스템-아키텍처)
5. [설치 및 실행 방법](#-설치-및-실행-방법)
6. [API 문서](#-api-문서)
7. [팀원 소개](#-팀원-소개)

---

## 💡 프로젝트 소개

### 🚩 문제 정의
- **내담자:** 회당 5~10만 원의 높은 비용, 기록이 남을까 하는 막연한 두려움(낙인 효과).
- **인턴 상담사:** 자격증 취득을 위한 수련 비용(약 800만 원) 부담과 실습 대상 확보의 어려움.

### 🎯 솔루션
- **합리적 가격:** 기존 비용의 5~10% 수준(회당 약 5,000원)으로 상담 제공.
- **AI 챗봇 초진:** 언제든 편하게 털어놓을 수 있는 AI 페르소나 챗봇을 통해 초기 심리 분석 및 문진표 자동 생성.
- **상호 윈윈:** 내담자는 저렴한 가격에, 인턴 상담사는 수련 기회 확보.

---

## ✨ 주요 기능

### 1. 페르소나 기반 AI 챗봇 상담
- **4가지 페르소나:** 건강, 관계, 경제/직업, 생활 등 내담자의 고민 유형에 맞는 AI 상담사 자동 매칭.
- **맞춤형 대화:** 사용자가 설정한 대화 스타일(공감형/해결형), 분위기(차분함/활기참), 상담 방식(경청/질문) 반영.
- **실시간 스트리밍:** Socket.io를 활용한 자연스러운 실시간 대화 경험 제공.

### 2. AI 자동 분석 및 리포트 생성 (CBT 기반)
- **위험 감지:** 대화 중 우울/불안 징후(Risk Level) 감지 시 자동으로 문진표 작성 유도.
- **심리 검사 자동화:** PHQ-9(우울), GAD-7(불안), PSS-10(스트레스) 척도 검사 지원.
- **CBT 분석:** 대화 내용을 바탕으로 상황, 감정, 자동적 사고, 대안적 사고를 분석하여 상담사에게 리포트 제공.

### 3. 인턴 상담사 예약 및 매칭
- **온/오프라인 상담:** 원하는 방식(화상/대면)으로 상담 예약.
- **상담사 정보:** 상담사의 프로필, 전문 분야 태그, 소개글 확인 가능.
- **슈퍼비전 시스템:** 모든 인턴 상담사는 전문 슈퍼바이저의 피드백을 받아 상담 품질 유지.

---

## 🛠 기술 스택

### 📱 Client (App)
| Tech | Description |
| --- | --- |
| **Framework** | React Native (Expo SDK 52) |
| **Language** | TypeScript |
| **State Mngt** | Zustand |
| **Navigation** | React Navigation v7 (Native Stack, Bottom Tabs) |
| **Communication** | Socket.io-client, Axios |
| **Form** | React Hook Form + Zod |

### 🖥 Server (Backend)
| Tech | Description |
| --- | --- |
| **Framework** | NestJS |
| **Language** | TypeScript |
| **Database (RDB)** | PostgreSQL (Prisma ORM) - 유저, 예약, 상담사 정보 |
| **Database (NoSQL)** | MongoDB (Mongoose) - 채팅 로그, 문진표 데이터 |
| **AI / LLM** | OpenAI API (GPT-4o-mini), Prompt Engineering |
| **Real-time** | Socket.io (WebSocket Gateway) |
| **Security** | JWT (Access/Refresh Token), Bcrypt |
| **Infra** | Docker, Nginx, Certbot (SSL) |

---

## 🏗 시스템 아키텍처

- **MCP (Model Context Protocol):** AI 에이전트가 페르소나 배정 도구 등을 활용할 수 있도록 모듈화.
- **Hybrid DB Strategy:** - 정형 데이터(회원, 결제, 예약)는 **PostgreSQL**로 무결성 보장.
    - 비정형/대용량 데이터(채팅 로그, AI 분석 결과)는 **MongoDB**로 유연성 확보.

---

## 🚀 설치 및 실행 방법

### 사전 요구사항 (Prerequisites)
- Node.js (v18+)
- PostgreSQL
- MongoDB
- Docker (Optional)

### 1. Repository Clone
```bash
git clone [https://github.com/YourRepo/Mindy.git](https://github.com/YourRepo/Mindy.git)
cd Mindy
````

### 2\. Backend (Server) 설정

```bash
cd server

# 패키지 설치
npm install

# 환경 변수 설정 (.env 파일 생성)
cp .env.sample .env
# .env 파일 내의 DATABASE_URL, MONGO_URI, OPENAI_API_KEY 등을 본인 환경에 맞게 수정하세요.

# Prisma DB 초기화
npx prisma generate
npx prisma migrate dev
npx prisma db seed # 초기 상담사 데이터 시딩

# 서버 실행
npm run start:dev
```

### 3\. Frontend (App) 설정

```bash
cd app

# 패키지 설치
npm install

# 환경 변수 설정 (.env 파일 생성)
cp .env.sample .env
# SERVER_URL을 로컬 IP 주소(예: [http://192.168.0.](http://192.168.0.)x:3000)로 설정하세요.

# 앱 실행
npx expo start
```

-----

## 📄 API 문서

서버 실행 후 아래 주소에서 Swagger 문서를 확인할 수 있습니다.(현재는 서버 운영 종료했습니다.)

  - URL: `http://localhost:3000/api-docs`

-----

## 👨‍💻 팀원 소개 (Team Meow)

| 이름 | 역할 | 소속 | 담당 업무 |
| :---: | :---: | :---: | :--- |
| **박성준** | 팀장 | 충북대 컴퓨터공학과 | 기획, 디자인 |
| **김동균** | 팀원 | 충북대 컴퓨터공학과 | 기획, 개발   |
| **심지명** | 팀원 | 충북대 컴퓨터공학과 | 기획, 개발   |
| **김선영** | 팀원 | 충북대 컴퓨터공학과 | 개발, 디자인 |

-----

## 📜 License

This project is licensed under the [MIT License](https://www.google.com/search?q=LICENSE).


