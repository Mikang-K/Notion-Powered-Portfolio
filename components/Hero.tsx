"use client";

import { motion } from "framer-motion";

// ─────────────────────────────────────────
// 편집 가능한 콘텐츠 & 스타일 설정
// 이 섹션만 수정하면 Hero 전체가 바뀝니다.
// ─────────────────────────────────────────
const HERO_CONFIG = {
  // 배지 (상단 작은 태그)
  badge: {
    text: "Available for work",
    // 배경/글자색: Tailwind 클래스로 지정
    className:
      "bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-300",
  },

  // 메인 헤딩
  heading: {
    prefix: "안녕하세요,",      // 그라디언트 전 텍스트
    highlight: "백진명",         // 그라디언트 강조 텍스트
    suffix: "입니다",            // 그라디언트 후 텍스트
    // 그라디언트 방향 및 색상
    gradientClass: "bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500",
    // 폰트 크기 (모바일/태블릿/PC)
    sizeClass: "text-5xl sm:text-6xl lg:text-6xl xl:text-7xl",
    // 자간
    trackingClass: "tracking-tight",
    // 굵기
    weightClass: "font-extrabold",
  },

  // 소개 문구
  description: {
    text: "노션으로 관리되는 포트폴리오입니다.\n프로젝트 경험과 기술 스택을 소개합니다.",
    // 폰트 크기
    sizeClass: "text-lg sm:text-xl xl:text-2xl",
    // 글자색
    colorClass: "text-neutral-500 dark:text-neutral-400",
    // 줄 간격
    leadingClass: "leading-relaxed",
  },

  // 버튼
  buttons: {
    primary: {
      label: "프로젝트 보기",
      href: "#projects",
      // 배경/글자 색상
      className:
        "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-500/25",
    },
    secondary: {
      label: "연락하기",
      href: "mailto:your@email.com",
      className:
        "border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800",
    },
  },

  // 레이아웃
  layout: {
    // 섹션 수직 정렬: "top" | "center" | "bottom"
    verticalAlign: "center" as "top" | "center" | "bottom",
    // 텍스트 정렬 (모바일): "center" | "left"
    mobileAlign: "center" as "center" | "left",
  },
};
// ─────────────────────────────────────────

const alignMap = {
  top: "items-start",
  center: "items-center",
  bottom: "items-end",
};

export function Hero() {
  const { badge, heading, description, buttons, layout } = HERO_CONFIG;
  const mobileTextAlign = layout.mobileAlign === "center" ? "text-center" : "text-left";
  const mobileItemsAlign = layout.mobileAlign === "center" ? "items-center" : "items-start";

  return (
    <section
      data-section="hero"
      className={`min-h-screen flex ${alignMap[layout.verticalAlign]} px-4 sm:px-6 lg:px-8 pt-14`}
    >
      <div className="max-w-7xl mx-auto w-full py-20">
        <div
          className={`flex flex-col ${mobileItemsAlign} ${mobileTextAlign} lg:text-left lg:items-start`}
        >
          {/* ── Left: Text ── */}
          <div className="lg:py-16 space-y-8">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              <span
                className={`inline-block px-4 py-1.5 text-xs font-semibold rounded-full tracking-wide ${badge.className}`}
              >
                {badge.text}
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              className={`${heading.sizeClass} ${heading.weightClass} ${heading.trackingClass} text-neutral-900 dark:text-neutral-100`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
            >
              {heading.prefix}{" "}
              <span
                className={`text-transparent bg-clip-text ${heading.gradientClass}`}
              >
                {heading.highlight}
              </span>{" "}
              {heading.suffix}
            </motion.h1>

            {/* Description */}
            <motion.p
              className={`${description.sizeClass} ${description.colorClass} ${description.leadingClass} max-w-lg whitespace-pre-line`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.2 }}
            >
              {description.text}
            </motion.p>

            {/* Buttons */}
            <motion.div
              className={`flex flex-col sm:flex-row gap-3 justify-${layout.mobileAlign} lg:justify-start`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.3 }}
            >
              <a
                href={buttons.primary.href}
                className={`inline-flex items-center justify-center px-7 py-3 rounded-xl font-semibold transition-all duration-200 ${buttons.primary.className}`}
              >
                {buttons.primary.label}
              </a>
              <a
                href={buttons.secondary.href}
                className={`inline-flex items-center justify-center px-7 py-3 rounded-xl font-semibold transition-all duration-200 ${buttons.secondary.className}`}
              >
                {buttons.secondary.label}
              </a>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
