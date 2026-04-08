# My Notion-Log Portfolio

노션(Notion)을 CMS로 활용한 개인 포트폴리오 웹사이트입니다. 노션의 편리한 콘텐츠 관리 기능과 커스텀 웹 디자인을 결합하였습니다.

---

## 주요 특징

- **Notion CMS 연동** — 노션 데이터베이스에서 프로젝트 목록과 상세 내용을 자동으로 가져옵니다.
- **SSG + ISR** — 빌드 타임에 정적 페이지를 생성하고, 1시간마다 자동 갱신합니다.
- **react-notion-x 렌더링** — 코드 블록, 토글, 콜아웃, 이미지 등 노션 블록을 그대로 렌더링합니다.
- **다크 모드 지원** — `next-themes`를 활용한 라이트/다크 테마 전환 (기본값: 다크).
- **반응형 디자인** — 모바일~데스크톱까지 최적화된 레이아웃.
- **Framer Motion 애니메이션** — 부드러운 페이지 진입 효과.

---

## 기술 스택

| 분류 | 기술 |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + CSS Variables |
| Animation | Framer Motion |
| CMS | Notion (@notionhq/client + notion-client) |
| Rendering | react-notion-x |
| Theme | next-themes |
| Deployment | Vercel |
| Node | 20.x |

---

## 프로젝트 구조

```
Notion-Powered Portfolio/
├── app/
│   ├── api/                   # 디버그 및 이미지 프록시 API 라우트
│   ├── projects/[slug]/       # 프로젝트 상세 페이지 (동적 라우트)
│   ├── layout.tsx             # 루트 레이아웃 (폰트, 테마 설정)
│   ├── page.tsx               # 홈 페이지 (Hero + 프로젝트 목록 + Skills)
│   ├── providers.tsx          # 테마 프로바이더
│   └── globals.css            # 전역 스타일
│
├── components/
│   ├── Hero.tsx               # 히어로 섹션
│   ├── Navbar.tsx             # 네비게이션 바
│   ├── ProjectList.tsx        # 프로젝트 그리드
│   ├── ProjectCard.tsx        # 프로젝트 카드
│   ├── Skills.tsx             # 기술 스택 섹션
│   ├── NotionRenderer.tsx     # 노션 블록 커스텀 렌더러
│   ├── NotionPage.tsx         # 노션 페이지 래퍼
│   └── NotionErrorBoundary.tsx
│
├── lib/
│   ├── notion.ts              # Notion API 연동 (데이터 fetch 로직)
│   ├── types.ts               # TypeScript 타입 정의
│   └── font-config.ts         # 폰트 설정
│
├── next.config.ts             # Next.js 설정 (이미지 도메인 등)
├── tailwind.config.ts
└── .env.local.example         # 환경 변수 템플릿
```

---

## 시작하기

### 1. 저장소 클론

```bash
git clone <repository-url>
cd "Notion-Powered Portfolio"
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경 변수 설정

`.env.local.example`을 복사하여 `.env.local`을 생성하고 값을 채웁니다.

```bash
cp .env.local.example .env.local
```

```env
# Notion 공식 API 통합 토큰
NOTION_TOKEN=secret_xxxxxxxxxxxx

# 프로젝트 목록이 담긴 노션 데이터베이스 ID
NOTION_PROJECTS_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# (선택) 비공개 페이지 접근용 token_v2
NOTION_TOKEN_V2=
```

> **Notion 토큰 발급:** [Notion Integrations](https://www.notion.so/my-integrations)에서 통합을 생성한 뒤, 대상 데이터베이스에 연결하세요.

### 4. 개발 서버 실행

```bash
npm run dev
# http://localhost:3002
```

### 5. 프로덕션 빌드

```bash
npm run build
npm run start
```

---

## Notion 데이터베이스 구조

프로젝트 데이터베이스에는 아래 프로퍼티가 필요합니다.

| 프로퍼티명 | 타입 | 설명 |
|---|---|---|
| 이름 | Title | 프로젝트 제목 |
| 소개 | Text | 프로젝트 설명 |
| 태그 | Multi-select | 기술 태그 (필터: "프로젝트" 태그 포함 항목만 조회) |
| 일자 | Date | 프로젝트 날짜 |
| 상태 | Select | `In Progress` / `Completed` / `Archived` |
| thumbnail | Files & media | 썸네일 이미지 |

---

## 시스템 아키텍처

```
Notion Database
      │
      ▼ (빌드 타임 / ISR)
Next.js (notion-client + @notionhq/client)
      │
      ▼ (데이터 변환)
react-notion-x + NotionRenderer
      │
      ▼ (정적 HTML/JS 생성)
Vercel 배포
```

---

## 주요 페이지

### 홈 (`/`)
- **Hero 섹션** — 배지, 제목, 설명, CTA 버튼 (Framer Motion 애니메이션)
- **프로젝트 목록** — 노션 데이터베이스에서 가져온 카드 그리드
- **Skills 섹션** — 보유 기술 스택 표시

### 프로젝트 상세 (`/projects/[slug]`)
- 노션 페이지 본문을 그대로 렌더링 (이미지, 코드 블록, 토글, 콜아웃 등)
- 데스크톱: 사이드바에 메타데이터(상태, 날짜, 태그) 표시
- `generateStaticParams()`로 모든 프로젝트 경로를 빌드 타임에 정적 생성

---

## 커스터마이징

### Hero 섹션 수정

[components/Hero.tsx](components/Hero.tsx) 상단의 `HERO_CONFIG` 객체를 수정하면 텍스트, 버튼, 애니메이션을 쉽게 변경할 수 있습니다.

### 폰트 변경

[lib/font-config.ts](lib/font-config.ts)에서 글로벌 및 섹션별 폰트를 설정합니다. 웹 폰트(CDN)와 로컬 폰트 모두 지원합니다.

### 이미지 도메인 추가

외부 이미지를 사용할 경우 [next.config.ts](next.config.ts)의 `remotePatterns`에 도메인을 추가합니다.

---

## 배포 (Vercel)

1. Vercel에 GitHub 저장소를 연결합니다.
2. **Environment Variables** 탭에서 `.env.local`의 환경 변수를 동일하게 설정합니다.
3. 빌드 커맨드: `npm run build` (기본값 사용)

---

## 라이선스

MIT
