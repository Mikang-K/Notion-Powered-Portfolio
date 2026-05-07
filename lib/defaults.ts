import type { AboutMeContent, SkillContent, ContactContent } from "./types";

export const defaultAbout: AboutMeContent = {
  heading: "개발로 생각을 현실로",
  gradientClass: "bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500",
  paragraphs: [
    "콘텐츠를 노션에서 관리하면서도 웹사이트는 내 색깔로 꾸미고 싶다는 욕심에서 이 포트폴리오가 시작됐습니다. '왜 둘 중 하나를 포기해야 하지?'라는 질문이 Next.js와 노션 API를 연결하는 첫 코드로 이어졌고, 그 태도가 지금 개발 방식의 출발점입니다.",
    "기술 선택에서도 같은 원칙을 따릅니다. App Router의 ISR로 성능과 콘텐츠 갱신을 동시에 잡고, TypeScript로 코드베이스를 안전하게 유지하면서, Tailwind CSS와 Framer Motion으로 세밀한 UX를 덧붙입니다. 어느 하나를 희생하지 않고 여러 목표를 한 흐름 안에서 풀어내는 것을 좋아합니다.",
    "요즘 가장 몰두하는 영역은 Claude Code와 harness engineering입니다. 단순히 AI에게 코드를 부탁하는 게 아니라, CLAUDE.md로 프로젝트의 맥락과 규칙을 AI에 내재화하고, hooks와 settings.json으로 협업 흐름 자체를 설계합니다. 이 구조가 잘 잡히면 '이 컴포넌트는 어떤 패턴으로 만들지?', '이 섹션의 네이밍은?' 같은 반복적인 판단은 AI가 일관되게 처리하고, 저는 방향과 품질 기준에 집중할 수 있습니다. 이 포트폴리오도 그 워크플로우로 설계부터 구현, 갭 분석까지 한 사이클을 완성했습니다.",
    "UX와 UI에도 신경을 쓰고 있습니다. 아무리 잘 만들어진 컨텐츠라도 유저가 불편하면 그 효과가 현저히 떨어지기에 테스트를 진행하면서 어떤 점이 불편할 지, 어떻게 개선할 수 있을 지 항상 생각하며 개발과 수정을 거듭하고 있습니다.",
  ],
  career: [
    { period: "2025.03 – 현재", role: "프리랜서 웹 개발자", company: "개인 프로젝트" },
    { period: "2024.06 – 2025.02", role: "프론트엔드 개발", company: "사이드 프로젝트 팀" },
  ],
  certifications: [
    { name: "정보처리기사", date: "2024.11", issuer: "한국산업인력공단" },
    { name: "SQLD", date: "2024.06", issuer: "한국데이터산업진흥원" },
  ],
};

export const defaultSkills: SkillContent[] = [
  {
    name: "Next.js",
    category: "Frontend",
    usage: "App Router + ISR을 활용해 이 포트폴리오를 SSG로 구축했습니다. SEO와 성능을 동시에 확보하면서도 콘텐츠 갱신 유연성을 유지했습니다.",
  },
  {
    name: "React",
    category: "Frontend",
    usage: "컴포넌트 기반 UI를 설계하고, Framer Motion과 함께 인터랙티브한 사용자 경험을 구현했습니다. 서버/클라이언트 컴포넌트를 목적에 맞게 분리합니다.",
  },
  {
    name: "TypeScript",
    category: "Frontend",
    usage: "Notion API 응답 데이터를 구조화된 타입으로 정의해 런타임 오류를 사전에 방지했습니다. 인터페이스 중심의 안정적인 코드베이스를 지향합니다.",
  },
  {
    name: "Tailwind CSS",
    category: "Frontend",
    usage: "다크모드 및 반응형 레이아웃을 유틸리티 클래스만으로 일관되게 구현했습니다. 디자인 토큰을 직접 클래스에 명시해 가독성과 유지보수성을 높입니다.",
  },
  {
    name: "Framer Motion",
    category: "Frontend",
    usage: "스크롤 진입 시 fade+slide 애니메이션, hover 인터랙션을 구현했습니다. 선언적 variant 패턴으로 애니메이션 로직을 컴포넌트와 분리합니다.",
  },
  {
    name: "Node.js",
    category: "Backend",
    usage: "Next.js 서버 컴포넌트와 API Routes에서 서버 사이드 데이터 처리를 담당합니다. Notion API 호출 및 데이터 가공 로직을 서버에서 실행합니다.",
  },
  {
    name: "Notion API",
    category: "Other",
    usage: "notion-client + react-notion-x를 활용해 노션 데이터베이스를 CMS로 연동했습니다. 복잡한 블록 데이터를 React 컴포넌트로 변환해 렌더링합니다.",
  },
  {
    name: "Vercel",
    category: "DevOps",
    usage: "GitHub 연동 CI/CD로 main 브랜치 푸시 시 자동 배포합니다. Edge Network을 통한 전 세계 빠른 응답과 ISR 캐시 무효화를 활용합니다.",
  },
  {
    name: "Claude Code",
    category: "AI",
    usage: "AI 네이티브 개발 워크플로우의 핵심 도구로 활용합니다. PDCA 사이클과 결합해 설계→구현→검증을 체계적으로 자동화하고, 이 포트폴리오도 Claude Code와 함께 설계부터 배포까지 완성했습니다.",
  },
  {
    name: "Harness Engineering",
    category: "AI",
    usage: "CLAUDE.md, hooks, settings.json을 조합해 프로젝트 전용 AI 협업 환경을 구축합니다. 컨텍스트 주입·자동화 파이프라인으로 AI 응답의 품질과 일관성을 제어하고 반복 작업을 제거합니다.",
  },
];

export const defaultContacts: ContactContent[] = [
  {
    label: "Email",
    value: "qorwlsaud1@gmail.com",
    href: "mailto:qorwlsaud1@gmail.com",
    description: "협업·채용 문의는 이메일로 편하게 연락 주세요.",
    iconType: "email",
  },
  {
    label: "GitHub",
    value: "github.com/Mikang87",
    href: "https://github.com/Mikang-K",
    description: "개인 프로젝트와 오픈소스 기여를 확인할 수 있습니다.",
    iconType: "github",
  },
];
