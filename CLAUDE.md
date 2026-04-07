## 📋 프로젝트 명세서: Notion-Powered Portfolio

### 1. 프로젝트 개요

- **프로젝트 명:** (가칭) My Notion-Log Portfolio
- **목적:** 노션의 콘텐츠 관리 편의성과 웹사이트의 시각적 커스텀 디자인을 결합한 개인 브랜딩 사이트 구축
- **주요 특징:**
    - 노션 데이터베이스를 CMS(Content Management System)로 활용
    - SSG(Static Site Generation)를 통한 빠른 페이지 로딩 및 SEO 최적화
    - `react-notion-x`를 이용한 고퀄리티 노션 페이지 렌더링

### 2. 기술 스택 (Tech Stack)

- **Framework:** `Next.js 14+` (App Router 권장)
- **Data Fetching:** `notion-client` (Notion 데이터 수집)
- **Rendering:** `react-notion-x` (JSON -> React 컴포넌트 변환)
- **Styling:** `Tailwind CSS` + `Framer Motion` (애니메이션)
- **Deployment:** `Vercel`

---

### 3. 시스템 아키텍처

노션 API는 일반적인 REST API보다 데이터 구조가 복잡하기 때문에 아래와 같은 흐름으로 동작합니다.

1. **Notion Database:** 프로젝트 리스트, 자기소개 등을 저장하는 데이터 저장소.
2. **Next.js (Build Time):** `notion-client`를 사용해 노션의 모든 페이지 데이터를 가져옴.
3. **Data Processing:** `react-notion-x`가 전달받은 복잡한 블록 데이터를 우리가 지정한 스타일로 변환.
4. **Static Hosting:** 최종 결과물을 HTML/JS로 생성하여 Vercel에 배포.

---

### 4. 핵심 기능 요구사항

### A. 메인 페이지 (Home)

- 나를 소개하는 **Hero Section** (직접 코딩)
- 노션 데이터베이스와 연동된 **프로젝트 카드 리스트** (썸네일, 제목, 태그)
- 기술 스택(Skill) 섹션

### B. 프로젝트 상세 페이지 (Dynamic Route)

- 노션의 본문 내용을 그대로 렌더링 (이미지, 코드 블록, 토글 등 포함)
- `react-notion-x`에서 지원하는 **Code, Equation, Collection** 컴포넌트 활용

### C. 부가 기능

- **다크 모드 지원:** `next-themes`를 활용한 테마 전환
- **이미지 최적화:** 노션 이미지 URL을 `next/image`와 연동하여 최적화
- **반응형 디자인:** 모바일에서도 가독성 좋은 레이아웃