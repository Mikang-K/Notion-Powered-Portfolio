# Plan: Home Resume Redesign

**Feature:** `home-resume-redesign`
**Phase:** Plan
**Created:** 2026-05-04
**Status:** In Progress

---

## Executive Summary

| 관점 | 내용 |
|------|------|
| **Problem** | 현재 메인 페이지는 Hero·ProjectList·Skills 3개 섹션의 단순 나열로, 방문자가 개발자의 정체성과 강점을 한눈에 파악하기 어렵다 |
| **Solution** | 좌측 고정 사이드바(프로필·Contact) + 우측 이력서형 콘텐츠 영역으로 레이아웃을 전환하고, About Me·Skills(프로젝트 연계 서술)·Contact 섹션을 추가·강화한다 |
| **Function UX Effect** | 방문자가 Sidebar에서 신원을 확인하고, 우측 스크롤로 About → Projects → Skills → Contact 순서로 개발자를 단계적으로 이해하는 자기소개서 흐름을 제공한다 |
| **Core Value** | 채용담당자·협업자가 페이지를 열자마자 "이 사람이 누구인가"를 직관적으로 파악할 수 있는 개인 브랜딩 강화 |

---

## Context Anchor

| 항목 | 내용 |
|------|------|
| **WHY** | 단순 포트폴리오 나열에서 → 나를 파악할 수 있는 자기소개서형 페이지로 전환해 채용/협업 기회 증대 |
| **WHO** | 채용담당자, 잠재적 협업자, 기술 커뮤니티 방문자 |
| **RISK** | 모바일에서 사이드바 레이아웃 복잡도 증가, 프로필 사진 로딩 최적화 필요 |
| **SUCCESS** | 사이드바가 모든 화면 너비에서 정상 동작, 3개 신규 섹션(About·Skills·Contact) 완성, 기존 Projects 섹션 유지 |
| **SCOPE** | 메인 페이지(`app/page.tsx`) + 관련 컴포넌트만 수정. Notion 데이터 연동 로직은 변경 없음 |

---

## 1. 요구사항 (Requirements)

### 1.1 기능 요구사항

| ID | 요구사항 | 우선순위 |
|----|----------|---------|
| FR-01 | 좌측 고정 사이드바: 프로필 사진, 이름, 한 줄 소개, Contact 링크(이메일·GitHub·블로그) 포함 | Must |
| FR-02 | About Me 섹션: 나를 소개하는 2~4 문단 서술 + violet 그라디언트 강조 요소 | Must |
| FR-03 | Projects 섹션: 기존 Notion 연동 ProjectList 유지 (위치만 이동) | Must |
| FR-04 | Skills 섹션 재편: 기술별 "실제 프로젝트에서의 활용 방식" 카드 형태로 서술형 표시 | Must |
| FR-05 | Contact 섹션: 이메일·GitHub·블로그/노션 링크 카드 + hover 애니메이션 | Must |
| FR-06 | 프로필 사진: next/image로 최적화, 둥근 원형 + violet 테두리 링 | Must |
| FR-07 | Navbar 앵커 링크를 새 섹션 구조에 맞게 업데이트 | Should |

### 1.2 비기능 요구사항

| ID | 요구사항 |
|----|----------|
| NFR-01 | 반응형: lg 이상에서 사이드바 고정, md 이하에서 상단 헤더형으로 전환 |
| NFR-02 | 다크모드 완전 지원 (next-themes 기존 설정 활용) |
| NFR-03 | Framer Motion 애니메이션: violet 그라디언트 테마 유지, 스크롤 진입 시 fade+slide |
| NFR-04 | Notion 데이터 fetching 로직(`lib/notion.ts`) 변경 없음 |
| NFR-05 | 빌드 시 TypeScript 에러 없음 |

---

## 2. 범위 (Scope)

### 포함 (In Scope)

- `app/page.tsx` 레이아웃 전환 (사이드바 + 콘텐츠 구조)
- `components/Sidebar.tsx` 신규 생성
- `components/Hero.tsx` → `components/AboutMe.tsx` 로 개편
- `components/Skills.tsx` 프로젝트 연계 서술형으로 재편
- `components/Contact.tsx` 신규 생성
- `components/Navbar.tsx` 앵커 링크 업데이트

### 제외 (Out of Scope)

- Career / Education (타임라인) 섹션 — 이번 버전 미포함
- Notion 데이터 연동 구조 변경
- 프로젝트 상세 페이지(`app/projects/[slug]/page.tsx`) 변경

---

## 3. 구현 계획 (Implementation Plan)

### 3.1 컴포넌트 구조

```
app/
  page.tsx              ← 사이드바 + 콘텐츠 레이아웃으로 재구성

components/
  Sidebar.tsx           ← 신규 (프로필 사진, 이름, 소개, Contact 링크)
  AboutMe.tsx           ← Hero.tsx 대체/개편
  ProjectList.tsx       ← 유지 (변경 없음)
  Skills.tsx            ← 서술형 카드로 재편
  Contact.tsx           ← 신규 (이메일·GitHub·블로그 카드)
  Navbar.tsx            ← 앵커 링크 수정
```

### 3.2 페이지 레이아웃 구조

```
<main className="lg:flex min-h-screen">
  {/* 좌측 고정 사이드바 (lg 이상에서 표시) */}
  <Sidebar className="lg:w-72 lg:sticky lg:top-0 lg:h-screen" />

  {/* 우측 메인 콘텐츠 (스크롤) */}
  <div className="flex-1">
    <AboutMe />          {/* id="about" */}
    <ProjectList />      {/* id="projects" */}
    <Skills />           {/* id="skills" */}
    <Contact />          {/* id="contact" */}
  </div>
</main>
```

### 3.3 Skills 서술형 카드 설계

각 기술에 대해 다음 정보를 카드로 표현:
- 기술명 + 카테고리 배지
- **"활용 사례"** 1~2 문장: 어떤 프로젝트에서 어떻게 사용했는지
- 예: `Next.js — App Router + ISR을 활용해 이 포트폴리오를 SSG로 구축했습니다`

### 3.4 Sidebar Contact 아이콘

| 항목 | 링크 | 아이콘 |
|------|------|--------|
| 이메일 | mailto:qorwlsaud1@gmail.com | Mail 아이콘 |
| GitHub | https://github.com/Mikang87 | GitHub SVG |
| 블로그/노션 | 추후 입력 | ExternalLink 아이콘 |

---

## 4. 위험 요소 (Risks)

| 위험 | 영향도 | 대응 |
|------|--------|------|
| 모바일에서 사이드바가 화면 공간을 과도하게 차지 | 높음 | md 이하에서 Sidebar를 컴팩트 헤더 형태로 교체 |
| 프로필 사진 URL 미제공 시 레이아웃 깨짐 | 중간 | 사진 없을 경우 이니셜 아바타 Fallback 처리 |
| Hero→AboutMe 컴포넌트 교체 시 기존 스타일 회귀 | 낮음 | 기존 animation config 패턴 재사용 |

---

## 5. 성공 기준 (Success Criteria)

| SC# | 기준 |
|-----|------|
| SC-01 | lg 화면(1024px+)에서 Sidebar가 좌측 고정, 우측 콘텐츠 스크롤 동작 |
| SC-02 | md 이하(768px) 모바일에서 Sidebar 없이 단일 컬럼 레이아웃 정상 동작 |
| SC-03 | About Me · Projects · Skills · Contact 4개 섹션 모두 렌더링 |
| SC-04 | Skills 섹션에서 각 기술별 활용 서술이 카드 형태로 표시 |
| SC-05 | Contact 링크 3개 (이메일·GitHub·블로그) 클릭 가능 |
| SC-06 | 다크모드 전환 시 모든 섹션 정상 표시 |
| SC-07 | `next build` TypeScript 에러 0개 |
