"use client";

import { motion } from "framer-motion";

const ABOUT_CONFIG = {
  label: "About Me",
  heading: "개발로 생각을 현실로",
  gradientClass: "bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500",
  paragraphs: [
    "콘텐츠를 노션에서 관리하면서도 웹사이트는 내 색깔로 꾸미고 싶다는 욕심에서 이 포트폴리오가 시작됐습니다. '왜 둘 중 하나를 포기해야 하지?'라는 질문이 Next.js와 노션 API를 연결하는 첫 코드로 이어졌고, 그 태도가 지금 개발 방식의 출발점입니다.",
    "기술 선택에서도 같은 원칙을 따릅니다. App Router의 ISR로 성능과 콘텐츠 갱신을 동시에 잡고, TypeScript로 코드베이스를 안전하게 유지하면서, Tailwind CSS와 Framer Motion으로 세밀한 UX를 덧붙입니다. 어느 하나를 희생하지 않고 여러 목표를 한 흐름 안에서 풀어내는 것을 좋아합니다.",
    "요즘 가장 몰두하는 영역은 Claude Code와 harness engineering입니다. 단순히 AI에게 코드를 부탁하는 게 아니라, CLAUDE.md로 프로젝트의 맥락과 규칙을 AI에 내재화하고, hooks와 settings.json으로 협업 흐름 자체를 설계합니다. 이 구조가 잘 잡히면 '이 컴포넌트는 어떤 패턴으로 만들지?', '이 섹션의 네이밍은?' 같은 반복적인 판단은 AI가 일관되게 처리하고, 저는 방향과 품질 기준에 집중할 수 있습니다. 이 포트폴리오도 그 워크플로우로 설계부터 구현, 갭 분석까지 한 사이클을 완성했습니다.",
    "작은 것도 쉽게 넘기지 않습니다. 코드 한 줄이 어색하거나, 애니메이션 타이밍이 0.05초 어긋나거나, 다크모드에서 색이 한 단계 어두워야 할 것이 그냥 지나가면 — 그 불편함을 끌어안고 고칩니다. 방문자는 그 디테일 하나하나를 의식하지 못할 수 있어도, 그것들이 쌓인 결과가 '이 사이트 왠지 잘 만들어졌다'는 느낌으로 전달된다고 믿기 때문입니다.",
  ],
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.1 },
  }),
};

export function AboutMe() {
  const { label, heading, gradientClass, paragraphs } = ABOUT_CONFIG;

  return (
    <section
      id="about"
      data-section="about"
      className="py-16 lg:py-24 px-6 lg:px-12"
    >
      <motion.span
        className="inline-block text-xs font-semibold uppercase tracking-widest text-violet-500 dark:text-violet-400 mb-4"
        custom={0}
        initial="hidden"
        animate="visible"
        variants={fadeUp}
      >
        {label}
      </motion.span>

      <motion.h2
        className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100 mb-10"
        custom={1}
        initial="hidden"
        animate="visible"
        variants={fadeUp}
      >
        <span className={`text-transparent bg-clip-text ${gradientClass}`}>
          {heading}
        </span>
      </motion.h2>

      <div className="max-w-2xl space-y-5">
        {paragraphs.map((text, i) => (
          <motion.p
            key={i}
            className="text-base sm:text-lg leading-relaxed text-neutral-600 dark:text-neutral-400"
            custom={i + 2}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            {text}
          </motion.p>
        ))}
      </div>
    </section>
  );
}
