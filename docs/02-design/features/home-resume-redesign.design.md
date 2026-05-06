# Design: Home Resume Redesign

**Feature:** `home-resume-redesign`
**Phase:** Design
**Architecture:** Option C — Pragmatic Balance
**Created:** 2026-05-04

---

## Context Anchor

| 항목 | 내용 |
|------|------|
| **WHY** | 단순 포트폴리오 나열에서 → 자기소개서형 페이지로 전환해 채용/협업 기회 증대 |
| **WHO** | 채용담당자, 잠재적 협업자, 기술 커뮤니티 방문자 |
| **RISK** | 모바일 사이드바 복잡도, 프로필 사진 Fallback 처리 |
| **SUCCESS** | 사이드바 전 해상도 동작, 4개 섹션 완성, next build 에러 0개 |
| **SCOPE** | app/page.tsx + components/ 변경만. lib/notion.ts 불변 |

---

## 1. Overview

### 1.1 선택 아키텍처: Option C — Pragmatic Balance

- `components/` 폴더 구조 유지 (하위 폴더 미도입)
- 신규 파일 3개(`Sidebar`, `AboutMe`, `Contact`) + 기존 파일 3개 수정(`page.tsx`, `Skills.tsx`, `Navbar.tsx`)
- `Hero.tsx` 는 삭제하지 않고 유지 (추후 재활용 여지)

### 1.2 아키텍처 결정 이유

| 항목 | 결정 |
|------|------|
| 폴더 구조 | 현행 flat `components/` 유지 → import 경로 변경 불필요 |
| Navbar | 상단 고정 유지 (다크모드 토글 보존), 사이드바는 `top-14` sticky |
| Hero.tsx | 삭제 대신 유지 → `AboutMe.tsx` 신규 생성으로 대체 |
| Notion 연동 | `lib/notion.ts` / `ProjectList.tsx` 전혀 수정 없음 |

---

## 2. 파일 변경 목록

| 파일 | 작업 | 주요 내용 |
|------|------|-----------|
| `app/page.tsx` | 수정 | Sidebar + 콘텐츠 flex 레이아웃, Hero → AboutMe 교체 |
| `components/Sidebar.tsx` | 신규 | 프로필 사진, 이름, 직함, Contact 링크 |
| `components/AboutMe.tsx` | 신규 | 2~3 문단 자기소개, violet 그라디언트 강조 |
| `components/Skills.tsx` | 수정 | 서술형 카드 (기술 + 활용 사례) |
| `components/Contact.tsx` | 신규 | 이메일·GitHub·블로그 링크 카드 |
| `components/Navbar.tsx` | 수정 | About·Projects·Skills·Contact 앵커 추가 |
| `components/Hero.tsx` | 유지 | 변경 없음 (미사용 상태) |
| `components/ProjectList.tsx` | 유지 | 변경 없음 |

---

## 3. 레이아웃 설계

### 3.1 전체 구조

```
┌─────────────────────────────────────────────────────┐
│  Navbar (fixed top-0, full-width, z-50, h-14)       │
├──────────────┬──────────────────────────────────────┤
│              │                                      │
│   Sidebar    │   Main Content (flex-1, scroll)      │
│  (lg: w-64   │                                      │
│   sticky     │   ┌──────────────────────────────┐   │
│   top-14     │   │  AboutMe    id="about"        │   │
│   h-screen   │   ├──────────────────────────────┤   │
│   overflow   │   │  ProjectList  id="projects"   │   │
│   -y-auto)   │   ├──────────────────────────────┤   │
│              │   │  Skills     id="skills"        │   │
│  [hidden on  │   ├──────────────────────────────┤   │
│   md 이하]   │   │  Contact    id="contact"       │   │
│              │   └──────────────────────────────┘   │
└──────────────┴──────────────────────────────────────┘
```

### 3.2 반응형 전략

| 브레이크포인트 | Sidebar | 콘텐츠 |
|----------------|---------|--------|
| `lg+` (1024px+) | `block w-64 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto` | `flex-1` |
| `md` (768px~) | `hidden` | 풀 너비 단일 컬럼 |
| `sm` (640px 이하) | `hidden` | 풀 너비 단일 컬럼 |

> 모바일에서는 Navbar의 "About" 링크로 첫 섹션 진입

---

## 4. 컴포넌트 상세 설계

### 4.1 `app/page.tsx`

```tsx
// 변경 전
<>
  <Hero />
  <ProjectList projects={projects} />
  <Skills />
</>

// 변경 후
<div className="flex min-h-screen pt-14">
  <Sidebar />                          {/* lg: sticky panel */}
  <main className="flex-1 min-w-0">
    <AboutMe />
    <ProjectList projects={projects} />
    <Skills />
    <Contact />
  </main>
</div>
```

### 4.2 `components/Sidebar.tsx`

**구조:**
```
Sidebar (fixed-height sticky panel)
├── ProfileImage          (next/image, circular, violet ring)
├── Name                  ("백진명")
├── Title                 ("Frontend Developer")
├── Divider
└── ContactList
    ├── EmailLink         (mailto:qorwlsaud1@gmail.com)
    ├── GitHubLink        (github.com/Mikang87)
    └── BlogLink          (플레이스홀더 → 추후 URL 입력)
```

**프로필 이미지 Fallback:**
- `src` 가 없거나 에러 시 → 이니셜 아이콘 (`BJ`, violet gradient background)

**코드 스케치:**
```tsx
const SIDEBAR_CONFIG = {
  name: "백진명",
  title: "Frontend Developer",
  profileImage: "/profile.jpg",   // public 폴더에 이미지 추가 후 경로 수정
  contact: {
    email: "qorwlsaud1@gmail.com",
    github: "https://github.com/Mikang87",
    blog: "",                     // 추후 입력
  },
};
```

**스타일:**
- 배경: `bg-white dark:bg-neutral-950 border-r border-neutral-200 dark:border-neutral-800`
- 프로필 링: `ring-2 ring-violet-500 ring-offset-2`
- Contact 아이콘: hover 시 `text-violet-500` 전환

### 4.3 `components/AboutMe.tsx`

**구조:**
```
AboutMe (id="about")
├── 섹션 레이블         ("About Me")
├── 제목               (gradient heading)
└── 소개 문단 × 3      (Framer Motion fade-in)
    ├── 문단 1: 나는 누구인가 (가치관/배경)
    ├── 문단 2: 무엇을 잘하는가 (기술/경험)
    └── 문단 3: 무엇을 원하는가 (목표/비전)
```

**기본 텍스트 (수정 가능한 CONFIG 형태):**
```tsx
const ABOUT_CONFIG = {
  label: "About Me",
  heading: "개발로 생각을 현실로",
  paragraphs: [
    "노션을 CMS로 활용한 포트폴리오를 직접 설계·구축한 개발자입니다...",
    "Next.js App Router와 ISR을 활용해 성능과 SEO를 동시에 잡는 것을 즐깁니다...",
    "새로운 기술을 빠르게 익히고, 작은 것부터 완성도 있게 만드는 것을 추구합니다.",
  ],
};
```

**애니메이션:** 기존 Hero 패턴 재사용 (`opacity: 0 → 1, y: 16 → 0, delay: 0.1n`)

### 4.4 `components/Skills.tsx` (재편)

**카드 구조:**
```tsx
interface Skill {
  name: string;
  category: string;
  usage: string;      // 활용 사례 서술 (1~2문장)
}
```

**카드 UI:**
```
┌─────────────────────────────────────────┐
│  [카테고리 배지]           기술명        │
│  ──────────────────────────────────────  │
│  활용 사례: 이 포트폴리오에서 App Router│
│  + ISR을 활용해 SSG 빌드를 구현했습니다│
└─────────────────────────────────────────┘
```

**그리드:** `grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6`

**기술 데이터 예시:**
```tsx
const skills: Skill[] = [
  {
    name: "Next.js",
    category: "Frontend",
    usage: "App Router + ISR을 활용해 이 포트폴리오를 SSG로 구축, SEO와 성능을 동시에 확보했습니다.",
  },
  {
    name: "React",
    category: "Frontend",
    usage: "컴포넌트 기반 UI를 설계하고, Framer Motion과 함께 인터랙티브한 사용자 경험을 구현했습니다.",
  },
  {
    name: "TypeScript",
    category: "Frontend",
    usage: "타입 안정성을 보장하며 Notion API 응답 데이터를 구조화된 타입으로 관리했습니다.",
  },
  {
    name: "Tailwind CSS",
    category: "Frontend",
    usage: "다크모드 및 반응형 레이아웃을 유틸리티 클래스만으로 일관되게 구현했습니다.",
  },
  {
    name: "Node.js",
    category: "Backend",
    usage: "Next.js API Routes 및 서버 컴포넌트에서 서버 사이드 로직을 처리합니다.",
  },
  {
    name: "Notion API",
    category: "Other",
    usage: "notion-client + react-notion-x를 활용해 노션을 CMS로 연동, 콘텐츠를 웹에 렌더링합니다.",
  },
];
```

### 4.5 `components/Contact.tsx`

**구조:**
```
Contact (id="contact")
├── 섹션 제목
└── ContactCard × 3
    ├── EmailCard     (Mail 아이콘, qorwlsaud1@gmail.com)
    ├── GitHubCard    (GitHub 아이콘, Mikang87)
    └── BlogCard      (ExternalLink 아이콘, 추후 URL)
```

**카드 hover 효과:** `scale-105 + shadow-lg + violet border` (Framer Motion whileHover)

### 4.6 `components/Navbar.tsx` (수정)

현재 앵커: `#projects`, `#skills`
변경 후: `#about`, `#projects`, `#skills`, `#contact` 추가

---

## 5. 디자인 토큰

| 토큰 | 값 |
|------|----|
| Primary gradient | `from-violet-500 via-fuchsia-500 to-indigo-500` |
| Sidebar width | `w-64` (256px) |
| Sidebar bg | `bg-white dark:bg-neutral-950` |
| Profile ring | `ring-2 ring-violet-500 ring-offset-2` |
| Card border | `border border-neutral-200 dark:border-neutral-800` |
| Card hover | `hover:border-violet-400 dark:hover:border-violet-600` |
| Section padding | `py-16 lg:py-24 px-6 lg:px-12` |

---

## 6. 의존성

추가 패키지 없음. 기존 스택만 사용:
- `next/image` (프로필 이미지 최적화)
- `framer-motion` (애니메이션)
- `next-themes` (다크모드)

---

## 7. 데이터 흐름

```
Notion API (build time)
    ↓ getProjects()
app/page.tsx (Server Component)
    ↓ props
  ProjectList (Client/Server)   ← 변경 없음

Static data (컴포넌트 내 CONFIG)
  SIDEBAR_CONFIG  → Sidebar.tsx
  ABOUT_CONFIG    → AboutMe.tsx
  skills[]        → Skills.tsx
  contacts[]      → Contact.tsx
```

---

## 8. 테스트 계획

| 테스트 | 확인 내용 |
|--------|-----------|
| 레이아웃 | lg(1280px) 사이드바 표시, md(768px) 사이드바 숨김 확인 |
| 다크모드 | 모든 섹션에서 light/dark 전환 확인 |
| 프로필 Fallback | `/profile.jpg` 없을 때 이니셜 아바타 표시 확인 |
| 앵커 링크 | Navbar의 4개 링크가 정확한 섹션으로 스크롤 이동 |
| 빌드 | `next build` TypeScript 에러 0개 |

---

## 9. 구현 순서 (Session Guide)

### Module Map

| 모듈 | 파일 | 예상 작업량 |
|------|------|-------------|
| M1 — 레이아웃 재구성 | `app/page.tsx`, `Sidebar.tsx` | ~80줄 |
| M2 — About Me | `AboutMe.tsx` | ~60줄 |
| M3 — Skills 재편 | `Skills.tsx` | ~80줄 |
| M4 — Contact | `Contact.tsx` | ~60줄 |
| M5 — Navbar 업데이트 | `Navbar.tsx` | ~10줄 |

### 권장 세션 계획

**단일 세션으로 전체 구현 가능 (총 ~290줄)**

구현 순서:
1. M1: `Sidebar.tsx` 신규 생성 → `page.tsx` 레이아웃 적용
2. M2: `AboutMe.tsx` 신규 생성
3. M3: `Skills.tsx` 내용 교체
4. M4: `Contact.tsx` 신규 생성
5. M5: `Navbar.tsx` 앵커 추가

> `/pdca do home-resume-redesign` 으로 구현 시작
