"use client";

import { motion } from "framer-motion";

const ABOUT_CONFIG = {
  label: "About Me",
  heading: "개발로 생각을 현실로",
  gradientClass: "bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500",
  paragraphs: [
    "노션을 CMS로 활용한 포트폴리오를 직접 설계·구축한 개발자입니다. 콘텐츠 관리의 편의성과 웹사이트의 시각적 자유도를 동시에 추구하며, 두 세계의 장점을 연결하는 것을 즐깁니다.",
    "Next.js App Router와 ISR을 활용해 성능과 SEO를 동시에 잡는 것을 즐깁니다. TypeScript로 타입 안정성을 확보하고, Tailwind CSS와 Framer Motion으로 세밀한 UI/UX를 구현합니다.",
    "새로운 기술을 빠르게 익히고, 작은 것부터 완성도 있게 만드는 것을 추구합니다. 코드 한 줄이 실제 사람의 경험을 바꾼다는 생각으로 개발합니다.",
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
