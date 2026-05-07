# admin-inline-cms Planning Document

> **Summary**: GitHub OAuth로 인증된 관리자가 포트폴리오 콘텐츠를 웹에서 직접 인라인 편집할 수 있는 CMS 기능
>
> **Project**: Notion-Powered Portfolio
> **Version**: 0.1.0
> **Author**: Mikang87
> **Date**: 2026-05-07
> **Status**: Draft

---

## Executive Summary

| Perspective | Content |
|-------------|---------|
| **Problem** | AboutMe·Skills·Contact·Projects 설정이 코드에 하드코딩되어 있어, 내용을 수정하려면 매번 코드 편집 → GitHub push → Vercel 재배포라는 번거로운 흐름이 필요하다 |
| **Solution** | GitHub OAuth 인증 기반의 관리자 모드를 추가하고, 각 섹션에 인라인 편집 UI를 붙여 변경 내용을 Vercel KV에 저장 후 ISR 재생성으로 즉시 반영 |
| **Function/UX Effect** | 관리자는 웹사이트에서 바로 ✏️ 버튼을 눌러 텍스트·목록을 수정하고 저장하면 수 초 내 반영. 방문자 경험은 동일하게 유지 |
| **Core Value** | 코드를 건드리지 않고도 포트폴리오 내용을 즉시 업데이트할 수 있는 개인 CMS 환경 구축 |

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

### 1.1 Purpose

포트폴리오 사이트의 하드코딩된 콘텐츠(소개글, 기술 스택, 연락처, 프로젝트 설정)를 코드 배포 없이 웹 UI에서 직접 수정·저장할 수 있게 한다.

### 1.2 Background

현재 `AboutMe.tsx`, `Skills.tsx`, `Contact.tsx`의 콘텐츠는 TypeScript 상수로 하드코딩되어 있다. 오탈자 하나를 고치거나 경력 항목을 추가하려 해도 "코드 편집 → commit → push → Vercel 재배포" 흐름이 필요하다. 관리자 인라인 편집 기능을 추가하면 이 흐름을 "로그인 → 클릭 → 저장"으로 단축할 수 있다.

Notion은 Projects 블록 콘텐츠에 최적화되어 있고, AboutMe·Skills·Contact는 구조화된 JSON 데이터라 Vercel KV가 더 적합하다.

### 1.3 Related Documents

- 기술 스택: `CLAUDE.md`
- 기존 Plan: `docs/01-plan/features/home-resume-redesign.plan.md`

---

## 2. Scope

### 2.1 In Scope

- [ ] GitHub OAuth 관리자 인증 (NextAuth.js v5)
- [ ] 로그인/로그아웃 버튼 (Navbar에 통합)
- [ ] 관리자 모드 시 각 섹션에 ✏️ 편집 버튼 표시
- [ ] **AboutMe** 인라인 편집: 헤딩, 소개 문단(추가/수정/삭제), 경력 항목, 자격증 항목
- [ ] **Skills** 인라인 편집: 스킬 추가/수정/삭제, 카테고리 변경
- [ ] **Contact** 인라인 편집: 연락처 항목 추가/수정/삭제
- [ ] **Projects 메타데이터** 편집: 고정(pin) 여부, 표시 순서 오버라이드, 숨김 처리
- [ ] Vercel KV에 콘텐츠 JSON 저장 (Server Actions)
- [ ] 저장 후 `revalidatePath('/')` 호출로 ISR 즉시 갱신
- [ ] KV에 데이터 없을 시 기존 하드코딩 값을 기본값(fallback)으로 사용
- [ ] 편집 UI는 관리자 세션에서만 렌더링 (방문자에게 비노출)

### 2.2 Out of Scope

- 다중 관리자 계정 (단일 소유자 포트폴리오이므로)
- Notion 데이터베이스 내 블록 콘텐츠 편집 (Notion CMS가 담당)
- 이미지 업로드 / 미디어 관리
- 버전 히스토리 / 변경 이력
- 콘텐츠 초안(Draft) 시스템

---

## 3. Requirements

### 3.1 Functional Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-01 | GitHub OAuth 로그인/로그아웃 (NextAuth.js v5) | High | Pending |
| FR-02 | 허용된 GitHub 계정(ADMIN_GITHUB_ID)만 관리자 권한 부여 | High | Pending |
| FR-03 | 관리자 세션 시 각 섹션에 ✏️ 편집 진입 버튼 표시 | High | Pending |
| FR-04 | AboutMe 섹션 인라인 편집 (헤딩/문단/경력/자격증) | High | Pending |
| FR-05 | Skills 섹션 인라인 편집 (스킬 CRUD, 카테고리 변경) | High | Pending |
| FR-06 | Contact 섹션 인라인 편집 (항목 CRUD) | High | Pending |
| FR-07 | Projects 메타데이터 편집 (pin/hide/order) | Medium | Pending |
| FR-08 | Server Action으로 콘텐츠를 Vercel KV에 저장 | High | Pending |
| FR-09 | 저장 후 revalidatePath로 ISR 캐시 갱신 | High | Pending |
| FR-10 | KV 데이터 없을 시 하드코딩 기본값 fallback | High | Pending |
| FR-11 | 편집 중 취소(Cancel) 시 원래 값으로 복원 | Medium | Pending |
| FR-12 | 저장 성공/실패 토스트 알림 | Medium | Pending |

### 3.2 Non-Functional Requirements

| Category | Criteria | Measurement Method |
|----------|----------|-------------------|
| Security | 관리자 Server Action에 세션 검증 필수 | 코드 리뷰, 미인증 요청 테스트 |
| Security | 방문자에게 편집 UI 완전 비노출 | 로그아웃 상태 화면 확인 |
| Performance | 저장 후 revalidate까지 60초 이내 | 직접 측정 |
| Reliability | KV 장애 시 기본값 fallback으로 사이트 정상 표시 | KV 연결 차단 테스트 |
| UX | 편집 버튼은 관리자에게만 자연스럽게 노출 | 시각적 검토 |

---

## 4. Success Criteria

### 4.1 Definition of Done

- [ ] GitHub 계정으로 로그인 후 관리자 모드 활성화 확인
- [ ] 4개 섹션(AboutMe/Skills/Contact/Projects) 편집 후 저장 성공
- [ ] 저장 후 60초 이내 실제 페이지에 변경 반영 확인
- [ ] 로그아웃 상태에서 편집 UI가 완전히 비노출됨을 확인
- [ ] KV 기본값 fallback 동작 확인

### 4.2 Quality Criteria

- [ ] 미인증 Server Action 호출 시 401/403 응답
- [ ] TypeScript 빌드 에러 없음
- [ ] 모바일 반응형에서 편집 UI 정상 동작

---

## 5. Risks and Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| NextAuth v5 beta API 변경 | High | Medium | 안정 버전 고정 (`next-auth@beta` 최신 고정), 공식 문서 기준 구현 |
| Vercel KV 무료 플랜 한도 초과 | Low | Low | 포트폴리오 규모에서 100MB / 30K 명령은 사실상 무제한에 가까움 |
| 관리자 GitHub ID 노출 | High | Low | `ADMIN_GITHUB_ID` 환경변수로만 관리, 코드에 하드코딩 금지 |
| ISR 재생성 지연 | Medium | Low | `revalidatePath` on-demand 사용, 최대 60초 내 반영 |
| 편집 중 새로고침으로 미저장 데이터 손실 | Low | Medium | 편집 상태 변경 시 `beforeunload` 경고 추가 |

---

## 6. Impact Analysis

### 6.1 Changed Resources

| Resource | Type | Change Description |
|----------|------|--------------------|
| `components/AboutMe.tsx` | Component | 정적 `ABOUT_CONFIG` → KV 데이터 우선 로드 + 인라인 편집 UI 조건부 렌더링 |
| `components/Skills.tsx` | Component | 정적 `skills[]` → KV 데이터 우선 로드 + 인라인 편집 UI |
| `components/Contact.tsx` | Component | 정적 `contacts[]` → KV 데이터 우선 로드 + 인라인 편집 UI |
| `components/Navbar.tsx` | Component | 로그인/로그아웃 버튼 추가 |
| `app/page.tsx` | Page | 콘텐츠를 서버에서 KV 조회 후 props로 전달 |
| `lib/kv.ts` | New Library | Vercel KV CRUD 헬퍼 함수 |
| `lib/auth.ts` | New Library | NextAuth 설정, 세션 타입 확장 |
| `app/api/auth/[...nextauth]/` | New Route | NextAuth 핸들러 |
| `app/actions/content.ts` | New Server Action | 콘텐츠 저장/조회 Server Actions |

### 6.2 Current Consumers

| Resource | Operation | Code Path | Impact |
|----------|-----------|-----------|--------|
| `ABOUT_CONFIG` | READ | `components/AboutMe.tsx` | KV fallback으로 교체 |
| `skills[]` | READ | `components/Skills.tsx` | KV fallback으로 교체 |
| `contacts[]` | READ | `components/Contact.tsx` | KV fallback으로 교체 |
| `app/page.tsx` | READ | `getProjects()` 호출 | 유지, KV 조회 추가 |

### 6.3 Verification

- [ ] 기존 Projects Notion 연동 정상 동작 유지 확인
- [ ] 기본값 fallback으로 KV 없는 환경(로컬)에서도 사이트 정상 표시 확인
- [ ] Navbar 변경 후 기존 반응형/다크모드 동작 확인

---

## 7. Architecture Considerations

### 7.1 Project Level Selection

| Level | Characteristics | Recommended For | Selected |
|-------|-----------------|-----------------|:--------:|
| **Starter** | 정적 구조 | 순수 정적 사이트 | ☐ |
| **Dynamic** | 기능 모듈, 인증, BaaS 연동 | 백엔드 포함 웹앱 | ☑ |
| **Enterprise** | 마이크로서비스, 엄격한 계층 분리 | 대규모 시스템 | ☐ |

**Dynamic 선정 이유**: 인증(NextAuth), 서버 상태 저장(Vercel KV), Server Actions를 포함하는 fullstack 기능이 추가됨.

### 7.2 Key Architectural Decisions

| Decision | Options | Selected | Rationale |
|----------|---------|----------|-----------|
| 인증 | NextAuth v5 / 자체 구현 | NextAuth v5 | 검증된 OAuth 라이브러리, App Router 완전 지원 |
| 저장소 | Vercel KV / Supabase / Notion | Vercel KV | Vercel 네이티브, Redis JSON 구조에 적합, 무료 |
| 데이터 패턴 | 전체 교체 / 부분 업데이트 | 섹션 단위 전체 교체 | 단순성 우선, 포트폴리오 규모에서 충분 |
| Server Action | Route Handler / Server Action | Server Action | Next.js 14 App Router 표준, 형변환 불필요 |
| 편집 UI | 인라인 / 별도 /admin | 섹션별 인라인 | 사용자 선택, 페이지 이동 없이 즉시 편집 가능 |
| 상태관리 | useState / Zustand | useState (local) | 편집 상태가 섹션 단위로 격리, 전역 불필요 |

### 7.3 데이터 구조 (Vercel KV)

```
KV Keys:
  portfolio:about    → AboutMeContent JSON
  portfolio:skills   → Skill[] JSON
  portfolio:contact  → ContactItem[] JSON
  portfolio:projects-meta → ProjectMeta[] JSON (pin/hide/order)

Fallback:
  KV에 키 없으면 각 컴포넌트의 기존 상수를 기본값으로 사용
```

### 7.4 폴더 구조 추가분

```
app/
  api/auth/[...nextauth]/route.ts   # NextAuth 핸들러
  actions/
    content.ts                      # Server Actions (save/load)
components/
  admin/
    EditableSection.tsx             # 편집 래퍼 컴포넌트
    InlineEditor.tsx                # 텍스트 인라인 에디터
    AdminToolbar.tsx                # 저장/취소 버튼
lib/
  auth.ts                          # NextAuth 설정
  kv.ts                            # Vercel KV 헬퍼
  defaults.ts                      # 하드코딩 기본값 (기존 상수 이전)
```

---

## 8. Convention Prerequisites

### 8.1 Existing Project Conventions

- [x] `CLAUDE.md` — 프로젝트 명세 존재
- [x] TypeScript (`tsconfig.json`)
- [x] Tailwind CSS
- [ ] ESLint 설정 확인 필요

### 8.2 Environment Variables Needed

| Variable | Purpose | Scope | To Be Created |
|----------|---------|-------|:-------------:|
| `AUTH_SECRET` | NextAuth 세션 서명 비밀키 | Server | ☑ |
| `AUTH_GITHUB_ID` | GitHub OAuth App Client ID | Server | ☑ |
| `AUTH_GITHUB_SECRET` | GitHub OAuth App Client Secret | Server | ☑ |
| `ADMIN_GITHUB_ID` | 관리자로 허용할 GitHub 사용자 ID | Server | ☑ |
| `KV_REST_API_URL` | Vercel KV 엔드포인트 | Server | ☑ (Vercel 자동 주입) |
| `KV_REST_API_TOKEN` | Vercel KV 인증 토큰 | Server | ☑ (Vercel 자동 주입) |

---

## 9. Implementation Phases

### Phase 1: 인증 + KV 인프라 (기반 작업)
1. Vercel KV 스토어 생성 및 프로젝트 연결
2. GitHub OAuth App 생성 (github.com/settings/developers)
3. NextAuth.js v5 설치 및 설정 (`lib/auth.ts`, `app/api/auth/[...nextauth]/route.ts`)
4. `lib/kv.ts` — KV CRUD 헬퍼 작성
5. `lib/defaults.ts` — 기존 하드코딩 상수 이전
6. Navbar에 로그인/로그아웃 버튼 추가

### Phase 2: 섹션 인라인 편집 UI
7. `components/admin/EditableSection.tsx` — 편집 래퍼
8. `app/actions/content.ts` — Server Actions (saveAbout, saveSkills, saveContact)
9. `app/page.tsx` — KV에서 콘텐츠 로드 후 컴포넌트에 props 전달
10. AboutMe 인라인 편집 통합
11. Skills 인라인 편집 통합
12. Contact 인라인 편집 통합

### Phase 3: Projects 메타데이터 편집
13. `app/actions/content.ts` — saveProjectsMeta Server Action 추가
14. Projects 섹션에 pin/hide/order 편집 UI 추가

---

## 10. Next Steps

1. [ ] Vercel KV 스토어 생성 (Vercel 대시보드에서)
2. [ ] GitHub OAuth App 생성 및 Client ID/Secret 발급
3. [ ] Design 문서 작성 (`/pdca design admin-inline-cms`)

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-05-07 | Initial draft | Mikang87 |
