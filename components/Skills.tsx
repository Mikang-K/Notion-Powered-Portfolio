"use client";

import { motion } from "framer-motion";

interface Skill {
  name: string;
  category: string;
  usage: string;
}

const categoryColors: Record<string, string> = {
  Frontend: "bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300",
  Backend: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300",
  DevOps: "bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300",
  Design: "bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300",
  Other: "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300",
};

const skills: Skill[] = [
  {
    name: "Next.js",
    category: "Frontend",
    usage:
      "App Router + ISR을 활용해 이 포트폴리오를 SSG로 구축했습니다. SEO와 성능을 동시에 확보하면서도 콘텐츠 갱신 유연성을 유지했습니다.",
  },
  {
    name: "React",
    category: "Frontend",
    usage:
      "컴포넌트 기반 UI를 설계하고, Framer Motion과 함께 인터랙티브한 사용자 경험을 구현했습니다. 서버/클라이언트 컴포넌트를 목적에 맞게 분리합니다.",
  },
  {
    name: "TypeScript",
    category: "Frontend",
    usage:
      "Notion API 응답 데이터를 구조화된 타입으로 정의해 런타임 오류를 사전에 방지했습니다. 인터페이스 중심의 안정적인 코드베이스를 지향합니다.",
  },
  {
    name: "Tailwind CSS",
    category: "Frontend",
    usage:
      "다크모드 및 반응형 레이아웃을 유틸리티 클래스만으로 일관되게 구현했습니다. 디자인 토큰을 직접 클래스에 명시해 가독성과 유지보수성을 높입니다.",
  },
  {
    name: "Framer Motion",
    category: "Frontend",
    usage:
      "스크롤 진입 시 fade+slide 애니메이션, hover 인터랙션을 구현했습니다. 선언적 variant 패턴으로 애니메이션 로직을 컴포넌트와 분리합니다.",
  },
  {
    name: "Node.js",
    category: "Backend",
    usage:
      "Next.js 서버 컴포넌트와 API Routes에서 서버 사이드 데이터 처리를 담당합니다. Notion API 호출 및 데이터 가공 로직을 서버에서 실행합니다.",
  },
  {
    name: "Notion API",
    category: "Other",
    usage:
      "notion-client + react-notion-x를 활용해 노션 데이터베이스를 CMS로 연동했습니다. 복잡한 블록 데이터를 React 컴포넌트로 변환해 렌더링합니다.",
  },
  {
    name: "Vercel",
    category: "DevOps",
    usage:
      "GitHub 연동 CI/CD로 main 브랜치 푸시 시 자동 배포합니다. Edge Network을 통한 전 세계 빠른 응답과 ISR 캐시 무효화를 활용합니다.",
  },
];

export function Skills() {
  return (
    <section
      id="skills"
      data-section="skills"
      className="py-16 lg:py-24 px-6 lg:px-12 bg-neutral-50 dark:bg-neutral-900/50"
    >
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
        Skills
      </h2>
      <p className="text-neutral-500 dark:text-neutral-400 mb-12 text-sm sm:text-base">
        실제 프로젝트에서 어떻게 활용했는지 기록합니다.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {skills.map((skill, index) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: index * 0.05 }}
            className="flex flex-col gap-3 p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 hover:border-violet-300 dark:hover:border-violet-700 transition-colors"
          >
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
                {skill.name}
              </h3>
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${categoryColors[skill.category] ?? categoryColors.Other}`}
              >
                {skill.category}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              {skill.usage}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
