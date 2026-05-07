# admin-inline-cms Design Document

> **Summary**: GitHub OAuth 인증 + Vercel KV + 섹션별 인라인 편집 UI로 포트폴리오 콘텐츠를 코드 없이 웹에서 직접 수정하는 CMS 기능 설계
>
> **Project**: Notion-Powered Portfolio
> **Version**: 0.1.0
> **Author**: Mikang87
> **Date**: 2026-05-07
> **Status**: Draft
> **Planning Doc**: [admin-inline-cms.plan.md](../01-plan/features/admin-inline-cms.plan.md)

---

## Context Anchor

| Key | Value |
|-----|-------|
| **WHY** | 코드 변경 없이 포트폴리오 콘텐츠를 웹에서 직접 수정할 수 있어야 함 |
| **WHO** | 사이트 소유자(관리자) 단일 사용자 |
| **RISK** | NextAuth + Vercel KV 설정 오류 시 admin 기능 전체 불동작 / 방문자 화면에 편집 UI 노출 |
| **SUCCESS** | 관리자 로그인 → 섹션 편집 → 저장 → 60초 내 페이지 반영이 코드 수정 없이 동작 |
| **SCOPE** | Phase 1: 인증 + KV 연동 / Phase 2: AboutMe·Skills·Contact 인라인 편집 / Phase 3: Projects 메타데이터 편집 |

---

## 1. Overview

### 1.1 Design Goals

- GitHub OAuth 기반의 단일 관리자 인증을 최소한의 설정으로 구현
- 모든 Server Action에 세션 기반 인증 검증을 적용하여 무단 편집 차단
- 섹션별 편집 UI를 `components/admin/` 공유 프리미티브로 집중하여 재사용성 확보
- 기존 하드코딩 상수를 `lib/defaults.ts`로 이전하여 KV fallback의 단일 진실 소스(source of truth) 확보
- ISR `revalidatePath`로 저장 즉시 방문자 화면에 반영

### 1.2 Design Principles

- **Props-driven 섹션**: AboutMe/Skills/Contact는 `content` + `isAdmin` props만 받고, 데이터 로드는 `app/page.tsx` 서버 컴포넌트에서 담당
- **로컬 상태 격리**: 편집 상태(`isEditing`, `draft`)는 각 섹션 컴포넌트의 `useState`로 격리. 전역 상태 불필요
- **보안 우선**: Server Action 진입 시 항상 `getSession() → isAdmin` 검증. 클라이언트 조건 렌더링은 UX 편의용, 보안 역할 아님
- **Fallback 무결성**: KV에 데이터 없어도 `lib/defaults.ts`의 기본값으로 사이트가 항상 정상 표시됨

---

## 2. Architecture

### 2.0 Architecture Comparison & Selection

| Criteria | Option A: Minimal | Option B: Clean | **Option C: Pragmatic** |
|----------|:-:|:-:|:-:|
| **Approach** | 각 컴포넌트에 직접 추가 | 계층별 완전 분리 | **admin/ 집중 + props 분리** |
| 신규 파일 | 3 | 15+ | **7** |
| 수정 파일 | 5 | 5 | **5** |
| 복잡도 | 낮음 | 높음 | **중간** |
| 유지보수성 | 낮음 | 최고 | **높음** |
| 구현 속도 | 빠름 | 느림 | **중간** |

**Selected**: **Option C — Pragmatic Balance**
**Rationale**: 단일 관리자 포트폴리오에서 완전한 계층 분리는 과도함. `components/admin/`에 편집 UI를 집중하고, 섹션 컴포넌트는 props만 받도록 최소 리팩터링하여 확장성과 단순성을 동시에 확보.

### 2.1 Component Diagram

```
┌─────────────────────────────────────────────────────────────┐
│  Browser (Client)                                           │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────────┐  │
│  │  Navbar     │  │ Section      │  │ Admin Toolbar     │  │
│  │ (Login/out) │  │ (Edit UI)    │  │ (Save/Cancel)     │  │
│  └──────┬──────┘  └──────┬───────┘  └────────┬──────────┘  │
└─────────┼───────────────┼───────────────────┼─────────────┘
          │               │                   │
          ▼               ▼                   ▼
┌─────────────────────────────────────────────────────────────┐
│  Next.js Server                                             │
│  ┌─────────────────────┐    ┌──────────────────────────┐   │
│  │  app/page.tsx       │    │  app/actions/content.ts  │   │
│  │  (Server Component) │    │  (Server Actions)        │   │
│  │  - getSession()     │    │  - saveAbout()           │   │
│  │  - kv.get(keys)     │    │  - saveSkills()          │   │
│  │  - props 전달       │    │  - saveContact()         │   │
│  └──────────┬──────────┘    │  - saveProjectsMeta()    │   │
│             │               │  + revalidatePath('/')   │   │
│  ┌──────────▼──────────┐    └──────────────┬───────────┘   │
│  │  lib/auth.ts        │                   │               │
│  │  lib/kv.ts          │◄──────────────────┘               │
│  │  lib/defaults.ts    │                                   │
│  └──────────┬──────────┘                                   │
└─────────────┼───────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────┐    ┌─────────────────────────┐
│  GitHub OAuth           │    │  Vercel KV (Redis)      │
│  (NextAuth v5)          │    │  portfolio:about        │
│                         │    │  portfolio:skills       │
│                         │    │  portfolio:contact      │
│                         │    │  portfolio:projects-meta│
└─────────────────────────┘    └─────────────────────────┘
```

### 2.2 인증 데이터 흐름

```
[관리자] GitHub 로그인 버튼 클릭
    → NextAuth /api/auth/signin/github
    → GitHub OAuth 동의
    → callback: profile.id === ADMIN_GITHUB_ID?
        YES: session.user.isAdmin = true → 쿠키 저장
        NO: session.user.isAdmin = false (일반 방문자)
    → app/page.tsx에서 getSession() → isAdmin props 전달
    → 각 섹션에 ✏️ Edit 버튼 렌더링
```

### 2.3 콘텐츠 편집 데이터 흐름

```
[관리자] ✏️ Edit 버튼 클릭
    → isEditing = true
    → draft = structuredClone(currentContent)
    → 편집 UI 표시

[관리자] 내용 수정 후 Save 클릭
    → Server Action 호출 (saveAbout(draft))
    → Server: getSession() → isAdmin 검증
    → Server: kv.set('portfolio:about', draft)
    → Server: revalidatePath('/')
    → Client: 성공 toast → isEditing = false

[관리자] Cancel 클릭
    → draft 폐기 → isEditing = false → 원래 값 유지
```

### 2.4 Dependencies

| Component | Depends On | Purpose |
|-----------|-----------|---------|
| `app/page.tsx` | `lib/auth.ts`, `lib/kv.ts`, `lib/defaults.ts` | 세션 + 콘텐츠 로드 |
| `app/actions/content.ts` | `lib/auth.ts`, `lib/kv.ts` | 저장 + 캐시 갱신 |
| `components/AboutMe.tsx` | `app/actions/content.ts`, `components/admin/*` | 편집 UI |
| `components/Skills.tsx` | `app/actions/content.ts`, `components/admin/*` | 편집 UI |
| `components/Contact.tsx` | `app/actions/content.ts`, `components/admin/*` | 편집 UI |
| `components/Navbar.tsx` | `lib/auth.ts` | 로그인/로그아웃 |

---

## 3. Data Model

### 3.1 TypeScript 타입 정의

```typescript
// lib/types/content.ts에 추가 (또는 lib/types.ts 확장)

export interface AboutMeContent {
  heading: string;
  gradientClass: string;
  paragraphs: string[];
  career: CareerItem[];
  certifications: CertificationItem[];
}

export interface CareerItem {
  period: string;
  role: string;
  company: string;
}

export interface CertificationItem {
  name: string;
  date: string;
  issuer: string;
}

export interface Skill {
  name: string;
  category: SkillCategory;
  usage: string;
}

export type SkillCategory = 'Frontend' | 'Backend' | 'DevOps' | 'Design' | 'AI' | 'Other';

export interface ContactItem {
  label: string;
  value: string;
  href: string;
  description: string;
  iconType: 'email' | 'github' | 'external';
}

export interface ProjectMeta {
  id: string;       // Notion 페이지 ID
  pinned: boolean;
  hidden: boolean;
  order?: number;   // 커스텀 표시 순서 (숫자 낮을수록 앞)
}
```

### 3.2 Vercel KV 스키마

| KV Key | Value Type | 기본값 출처 |
|--------|-----------|------------|
| `portfolio:about` | `AboutMeContent` (JSON) | `lib/defaults.ts` → `defaultAbout` |
| `portfolio:skills` | `Skill[]` (JSON) | `lib/defaults.ts` → `defaultSkills` |
| `portfolio:contact` | `ContactItem[]` (JSON) | `lib/defaults.ts` → `defaultContacts` |
| `portfolio:projects-meta` | `ProjectMeta[]` (JSON) | 빈 배열 `[]` (Notion 데이터 그대로 사용) |

### 3.3 NextAuth 세션 타입 확장

```typescript
// lib/auth.ts
declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      isAdmin: boolean;
      githubId?: string;
    }
  }
}
```

---

## 4. Server Actions Specification

> Next.js App Router Server Actions 사용. REST API Route Handler 아님.

### 4.1 Server Action 목록

| Action | 파일 | 역할 | 인증 |
|--------|------|------|------|
| `saveAboutContent` | `app/actions/content.ts` | AboutMe KV 저장 + revalidate | isAdmin 필수 |
| `saveSkills` | `app/actions/content.ts` | Skills KV 저장 + revalidate | isAdmin 필수 |
| `saveContact` | `app/actions/content.ts` | Contact KV 저장 + revalidate | isAdmin 필수 |
| `saveProjectsMeta` | `app/actions/content.ts` | ProjectsMeta KV 저장 + revalidate | isAdmin 필수 |

### 4.2 Server Action 구현 패턴

```typescript
// app/actions/content.ts
'use server';

import { auth } from '@/lib/auth';
import { kv } from '@/lib/kv';
import { revalidatePath } from 'next/cache';
import type { AboutMeContent, Skill, ContactItem, ProjectMeta } from '@/lib/types';

async function assertAdmin() {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    throw new Error('UNAUTHORIZED');
  }
}

export async function saveAboutContent(data: AboutMeContent) {
  await assertAdmin();
  await kv.set('portfolio:about', data);
  revalidatePath('/');
}

// saveSkills, saveContact, saveProjectsMeta — 동일 패턴
```

### 4.3 에러 응답

| 상황 | 클라이언트 처리 |
|------|----------------|
| `UNAUTHORIZED` | "권한이 없습니다" toast |
| KV 저장 실패 | "저장에 실패했습니다. 다시 시도해주세요" toast |
| 네트워크 오류 | "연결을 확인해주세요" toast |

---

## 5. UI/UX Design

### 5.1 전체 페이지 레이아웃 (관리자 뷰)

```
┌─────────────────────────────────────────────┐
│ Navbar  [Admin 배지] [아바타]  [Logout]      │
├─────────────────────────────────────────────┤
│ About Me                          [✏️ Edit] │
│  소개 텍스트...                             │
├─────────────────────────────────────────────┤
│ Projects                          [설정 아이콘]│
│  [카드 위에 📌핀 🙈숨김 버튼]               │
├─────────────────────────────────────────────┤
│ Skills                            [✏️ Edit] │
│  스킬 목록...                               │
├─────────────────────────────────────────────┤
│ Contact                           [✏️ Edit] │
│  연락처 목록...                             │
└─────────────────────────────────────────────┘
```

### 5.2 편집 모드 UX (AboutMe 예시)

```
┌─────────────────────────────────────────────┐
│ About Me                    [💾 Save][✕ Cancel]│
│                                             │
│ 헤딩: [개발로 생각을 현실로           ▏]   │
│                                             │
│ 문단 1: [████████████████████████████ ▏]   │
│          [+ 문단 추가]  [🗑 삭제]           │
│                                             │
│ 경력 —————————————————————————————          │
│ [2025.03 – 현재] [프리랜서 웹 개발자]       │
│ [개인 프로젝트                    ]  [🗑]   │
│ [+ 경력 추가]                               │
│                                             │
│ 자격증 ——————————————————————————           │
│ [정보처리기사] [2024.11] [한국산업인력]  [🗑]│
│ [+ 자격증 추가]                             │
│                                             │
│              [💾 저장]  [✕ 취소]           │
└─────────────────────────────────────────────┘
```

### 5.3 Component List

| Component | 위치 | 역할 |
|-----------|------|------|
| `EditableSection` | `components/admin/EditableSection.tsx` | isAdmin일 때 ✏️ Edit 버튼 + 편집/뷰 토글 래퍼 |
| `AdminToolbar` | `components/admin/AdminToolbar.tsx` | Save / Cancel 버튼 + 로딩 스피너 + 에러 상태 |
| `Navbar` (수정) | `components/Navbar.tsx` | 로그인/로그아웃 + Admin 배지 추가 |
| `AboutMe` (수정) | `components/AboutMe.tsx` | `content` props 기반, 편집 UI 조건부 렌더링 |
| `Skills` (수정) | `components/Skills.tsx` | `content` props 기반, 편집 UI 조건부 렌더링 |
| `Contact` (수정) | `components/Contact.tsx` | `content` props 기반, 편집 UI 조건부 렌더링 |

### 5.4 Page UI Checklist

#### Navbar (관리자 로그인 상태)
- [ ] Button: "Admin" 배지 표시 (관리자 식별)
- [ ] Avatar: GitHub 프로필 이미지
- [ ] Button: Logout 버튼

#### Navbar (비로그인 상태)
- [ ] Button: Login 버튼 (GitHub 아이콘 포함)

#### 메인 페이지 — 관리자 뷰 (편집 전)
- [ ] Button: AboutMe 섹션 우상단 ✏️ Edit 버튼
- [ ] Button: Skills 섹션 우상단 ✏️ Edit 버튼
- [ ] Button: Contact 섹션 우상단 ✏️ Edit 버튼
- [ ] Button: Projects 각 카드에 📌 핀/🙈 숨김 토글 버튼

#### AboutMe 편집 모드
- [ ] Input: 헤딩 텍스트 입력 필드
- [ ] Textarea: 소개 문단 각각 (현재 수: 4개)
- [ ] Button: 문단 추가 버튼
- [ ] Button: 문단 삭제 버튼 (각 항목)
- [ ] Input: 경력 항목 각각 (period, role, company — 3개 필드)
- [ ] Button: 경력 추가 버튼
- [ ] Button: 경력 삭제 버튼 (각 항목)
- [ ] Input: 자격증 항목 각각 (name, date, issuer — 3개 필드)
- [ ] Button: 자격증 추가 버튼
- [ ] Button: 자격증 삭제 버튼 (각 항목)
- [ ] Button: Save (loading state 포함)
- [ ] Button: Cancel

#### Skills 편집 모드
- [ ] Input: 각 스킬 name 입력
- [ ] Select: 카테고리 드롭다운 (Frontend/Backend/DevOps/Design/AI/Other)
- [ ] Textarea: 각 스킬 usage 설명
- [ ] Button: 스킬 추가 버튼
- [ ] Button: 스킬 삭제 버튼 (각 항목)
- [ ] Button: Save / Cancel

#### Contact 편집 모드
- [ ] Input: label, value, href, description (각 항목 4개 필드)
- [ ] Select: iconType (email/github/external)
- [ ] Button: 항목 추가 버튼
- [ ] Button: 항목 삭제 버튼
- [ ] Button: Save / Cancel

#### 공통 (편집 저장 후)
- [ ] Toast: 저장 성공 "저장되었습니다" 메시지
- [ ] Toast: 저장 실패 에러 메시지

---

## 6. Error Handling

### 6.1 에러 코드 정의

| 상황 | 처리 | 사용자 피드백 |
|------|------|--------------|
| 미인증 요청 (Server Action) | throw UNAUTHORIZED | 화면에 토스트, 편집 UI 숨김 |
| KV 저장 실패 | catch → return error | "저장 실패" 토스트 |
| KV 조회 실패 (페이지 로드) | catch → defaults fallback | 사이트 정상 표시 |
| GitHub OAuth 실패 | NextAuth 기본 에러 페이지 | — |
| 네트워크 타임아웃 | catch → return error | "연결 오류" 토스트 |

### 6.2 KV 헬퍼 에러 패턴

```typescript
// lib/kv.ts
export async function getContent<T>(key: string, fallback: T): Promise<T> {
  try {
    const data = await kv.get<T>(key);
    return data ?? fallback;
  } catch {
    return fallback; // KV 장애 시 기본값 반환, 사이트 정상 작동 보장
  }
}
```

---

## 7. Security Considerations

- [x] **Server Action 인증**: 모든 save* Action에 `assertAdmin()` 진입부 검증
- [x] **환경변수 보안**: `ADMIN_GITHUB_ID`는 서버 전용 환경변수, 코드에 하드코딩 금지
- [x] **클라이언트 신뢰 금지**: 클라이언트의 `isAdmin` prop은 UX용. 실제 보안은 Server Action에서만
- [x] **CSRF**: Next.js Server Actions는 기본 CSRF 보호 내장
- [x] **세션 쿠키**: NextAuth `httpOnly`, `secure` 기본 설정 유지
- [ ] **Rate Limiting**: 현재 범위 밖 (단일 관리자이므로 불필요)

---

## 8. Test Plan

### 8.1 Test Scope

| Type | Target | Tool | Phase |
|------|--------|------|-------|
| L1: Action Tests | Server Actions 인증 검증 | curl / fetch | Do |
| L2: UI Action Tests | 편집 버튼, 저장/취소 동작 | 수동 / Playwright | Do |
| L3: E2E Scenario | 로그인 → 편집 → 저장 → 반영 확인 | 수동 | Do |

### 8.2 L1: Server Action 테스트 시나리오

| # | Action | 조건 | 기대 결과 |
|---|--------|------|-----------|
| 1 | `saveAboutContent` | 미인증 세션 | `UNAUTHORIZED` 에러 |
| 2 | `saveAboutContent` | 관리자 세션, 유효 데이터 | KV 저장 성공, revalidate 완료 |
| 3 | `saveSkills` | 관리자 세션, 빈 배열 | KV 저장 성공 (빈 Skills 허용) |
| 4 | `getContent('portfolio:about', default)` | KV 키 없음 | defaultAbout 반환 |

### 8.3 L2: UI Action 테스트 시나리오

| # | 페이지/상태 | Action | 기대 결과 |
|---|------------|--------|-----------|
| 1 | 메인 (비로그인) | 페이지 로드 | 편집 버튼 없음, 콘텐츠 정상 표시 |
| 2 | 메인 (관리자) | 페이지 로드 | 각 섹션 ✏️ Edit 버튼 표시 |
| 3 | AboutMe (관리자) | Edit 버튼 클릭 | 편집 모드 진입, 입력 필드 표시 |
| 4 | AboutMe 편집 모드 | 내용 수정 후 Save | 로딩 → 성공 toast → 뷰 모드 복귀 |
| 5 | AboutMe 편집 모드 | Cancel 클릭 | 원래 내용 복원 → 뷰 모드 복귀 |
| 6 | Skills 편집 모드 | 스킬 추가 후 Save | 새 스킬 표시됨 |
| 7 | Contact 편집 모드 | 항목 삭제 후 Save | 삭제된 항목 사라짐 |

### 8.4 L3: E2E 시나리오

| # | 시나리오 | 단계 | 성공 기준 |
|---|---------|------|-----------|
| 1 | 관리자 풀 플로우 | Login → AboutMe Edit → 문단 수정 → Save → 새로고침 | 수정된 내용이 새로고침 후에도 유지 |
| 2 | 비방문자 보호 | Logout → 메인 페이지 | 편집 버튼 없음, 콘텐츠 정상 표시 |
| 3 | Fallback 동작 | KV 키 삭제 후 페이지 로드 | 기본값으로 정상 표시 |

---

## 9. Clean Architecture (Dynamic Level)

### 9.1 Layer Assignment

| Component/File | Layer | 역할 |
|----------------|-------|------|
| `components/AboutMe.tsx` | Presentation | 콘텐츠 렌더링 + 편집 UI |
| `components/Skills.tsx` | Presentation | 콘텐츠 렌더링 + 편집 UI |
| `components/Contact.tsx` | Presentation | 콘텐츠 렌더링 + 편집 UI |
| `components/admin/EditableSection.tsx` | Presentation | 편집 진입 UI 래퍼 |
| `components/admin/AdminToolbar.tsx` | Presentation | 저장/취소 버튼 |
| `components/Navbar.tsx` | Presentation | 로그인/로그아웃 |
| `app/actions/content.ts` | Application | 비즈니스 로직 (검증 + 저장) |
| `app/page.tsx` | Application | 데이터 조합 + props 전달 |
| `lib/auth.ts` | Infrastructure | NextAuth 설정 |
| `lib/kv.ts` | Infrastructure | Vercel KV 접근 |
| `lib/defaults.ts` | Domain | 콘텐츠 기본값 (순수 데이터) |
| `lib/types.ts` (확장) | Domain | TypeScript 타입 정의 |

---

## 10. Coding Convention Reference

### 10.1 이 기능의 컨벤션

| Item | Convention |
|------|-----------|
| Admin 컴포넌트 | `components/admin/` 폴더, PascalCase |
| Server Action | `'use server'` directive, `app/actions/` 폴더 |
| KV 키 | `portfolio:{section}` 형식 (예: `portfolio:about`) |
| 환경변수 | 서버 전용은 `AUTH_`, `KV_` 접두사 |
| 편집 상태 | 각 컴포넌트의 `useState`, Zustand 사용 금지 |
| 아이콘 타입 | JSX 대신 `iconType: 'email' | 'github' | 'external'` 문자열 enum |

---

## 11. Implementation Guide

### 11.1 File Structure (신규/수정 파일)

```
app/
├── page.tsx                          # [수정] KV 로드 + session + props 전달
├── api/
│   └── auth/
│       └── [...nextauth]/
│           └── route.ts              # [신규] NextAuth 핸들러
└── actions/
    └── content.ts                    # [신규] Server Actions

components/
├── admin/
│   ├── EditableSection.tsx           # [신규] 편집 래퍼
│   └── AdminToolbar.tsx              # [신규] 저장/취소 버튼
├── Navbar.tsx                        # [수정] 로그인/로그아웃 버튼
├── AboutMe.tsx                       # [수정] props 기반 + 편집 UI
├── Skills.tsx                        # [수정] props 기반 + 편집 UI
└── Contact.tsx                       # [수정] props 기반 + 편집 UI

lib/
├── auth.ts                           # [신규] NextAuth 설정
├── kv.ts                             # [신규] Vercel KV 헬퍼
└── defaults.ts                       # [신규] 기존 상수 → 기본값
```

### 11.2 Implementation Order

1. [ ] **패키지 설치**: `next-auth@beta`, `@vercel/kv`
2. [ ] `lib/defaults.ts` — 기존 `ABOUT_CONFIG`, `skills[]`, `contacts[]` 이전
3. [ ] `lib/auth.ts` — NextAuth v5 GitHub OAuth 설정 + isAdmin 콜백
4. [ ] `app/api/auth/[...nextauth]/route.ts` — NextAuth 핸들러
5. [ ] `lib/kv.ts` — `getContent()`, `setContent()` 헬퍼
6. [ ] `app/actions/content.ts` — 4개 Server Action 구현
7. [ ] `app/page.tsx` — KV 데이터 + session 로드, props 전달
8. [ ] `components/Navbar.tsx` — 로그인/로그아웃/Admin 배지
9. [ ] `components/admin/EditableSection.tsx` — 편집 래퍼
10. [ ] `components/admin/AdminToolbar.tsx` — 저장/취소 버튼
11. [ ] `components/AboutMe.tsx` — props 기반 리팩터링 + 편집 UI
12. [ ] `components/Skills.tsx` — props 기반 리팩터링 + 편집 UI
13. [ ] `components/Contact.tsx` — props 기반 리팩터링 + 편집 UI
14. [ ] Projects 메타데이터 편집 (Phase 3, 선택적)

### 11.3 Session Guide

#### Module Map

| Module | Scope Key | Description | 예상 소요 |
|--------|-----------|-------------|:---------:|
| 인프라 기반 | `module-1` | defaults + auth + kv + NextAuth 핸들러 + Server Actions | 40-50턴 |
| 페이지 연동 | `module-2` | app/page.tsx KV 로드 + Navbar 로그인/로그아웃 | 15-20턴 |
| Admin UI | `module-3` | EditableSection + AdminToolbar 공유 컴포넌트 | 15-20턴 |
| 섹션 편집 | `module-4` | AboutMe + Skills + Contact 편집 통합 | 40-50턴 |
| Projects 메타 | `module-5` | ProjectsMeta 편집 (Phase 3) | 20-30턴 |

#### Recommended Session Plan

| Session | 모듈 | Scope | 예상 턴 |
|---------|------|-------|:-------:|
| Session 1 | Plan + Design | 전체 | 완료 ✅ |
| Session 2 | module-1 + module-2 | `--scope module-1,module-2` | 50-60 |
| Session 3 | module-3 + module-4 | `--scope module-3,module-4` | 50-60 |
| Session 4 | module-5 + Check | `--scope module-5` | 30-40 |

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-05-07 | Initial draft (Option C — Pragmatic Balance) | Mikang87 |
