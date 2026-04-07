import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Inter,
  Noto_Sans_KR,
  Noto_Serif_KR,
  JetBrains_Mono,
} from "next/font/google";
import { Providers } from "./providers";
import { Navbar } from "@/components/Navbar";
import { fontConfig } from "@/lib/font-config";
import "./globals.css";

// ─── 빌트인 Google Fonts 로드 ────────────────────────────────────────────────
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});
const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});
const notoSerifKR = Noto_Serif_KR({
  variable: "--font-noto-serif-kr",
  subsets: ["latin"],
  weight: ["400", "700"],
});
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

// ─── 폰트 키 해석 ────────────────────────────────────────────────────────────
// 빌트인 키 목록 (CSS 변수가 등록된 폰트)
const BUILTIN_KEYS = new Set([
  "geist-sans",
  "inter",
  "noto-sans-kr",
  "noto-serif-kr",
  "geist-mono",
  "jetbrains-mono",
]);

/**
 * 폰트 값 → CSS font-family 값으로 변환
 * - 빌트인 키 or 로컬 등록 키  → var(--font-키)
 * - 그 외 임의 문자열           → 그대로 사용 (브라우저가 시스템 폰트에서 탐색)
 */
function resolve(value: string | null, fallback: string): string {
  const key = value ?? fallback;
  const localKeys = new Set([
    ...fontConfig.localFonts.map((f) => f.name),
    ...fontConfig.webFonts.map((f) => f.name),
  ]);
  if (BUILTIN_KEYS.has(key) || localKeys.has(key)) {
    return `var(--font-${key})`;
  }
  // 등록되지 않은 이름 → 브라우저가 시스템/로컬 폰트에서 탐색
  return key;
}

// ─── 커스텀 폰트 @font-face 생성 ─────────────────────────────────────────────
function buildCustomFontStyles(): string {
  const blocks: string[] = [];

  // 웹 폰트 (URL)
  for (const { name, family, src, weight = "normal", style = "normal" } of fontConfig.webFonts) {
    const srcValue = src.map(({ url, format }) => `url("${url}") format("${format}")`).join(",\n       ");
    blocks.push(
      [
        `@font-face {`,
        `  font-family: "${family}";`,
        `  src: ${srcValue};`,
        `  font-weight: ${weight};`,
        `  font-style: ${style};`,
        `  font-display: swap;`,
        `}`,
        `body { --font-${name}: "${family}"; }`,
      ].join("\n")
    );
  }

  // 로컬(시스템) 폰트
  for (const { name, family } of fontConfig.localFonts) {
    const families = Array.isArray(family) ? family : [family];
    const primaryFamily = families[0];
    const src = families.map((f) => `local("${f}")`).join(", ");
    blocks.push(
      [
        `@font-face {`,
        `  font-family: "${primaryFamily}";`,
        `  src: ${src};`,
        `  font-display: swap;`,
        `}`,
        `body { --font-${name}: "${primaryFamily}"; }`,
      ].join("\n")
    );
  }

  return blocks.join("\n");
}

export const metadata: Metadata = {
  title: "My Notion-Log Portfolio",
  description:
    "노션을 CMS로 활용한 개인 포트폴리오. 프로젝트와 기술 스택을 확인하세요.",
  openGraph: {
    title: "My Notion-Log Portfolio",
    description: "노션을 CMS로 활용한 개인 포트폴리오",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { global, sections } = fontConfig;

  const fontVars = {
    "--font-active-sans": resolve(global.sans, "noto-sans-kr"),
    "--font-active-mono": resolve(global.mono, "geist-mono"),
    "--font-hero":        resolve(sections.hero, global.sans),
    "--font-navbar":      resolve(sections.navbar, global.sans),
    "--font-projects":    resolve(sections.projects, global.sans),
    "--font-skills":      resolve(sections.skills, global.sans),
    "--font-notion":      resolve(sections.notion, global.sans),
  } as React.CSSProperties;

  const fontClasses = [
    geistSans.variable,
    geistMono.variable,
    inter.variable,
    notoSansKR.variable,
    notoSerifKR.variable,
    jetbrainsMono.variable,
  ].join(" ");

  const localFontStyles = buildCustomFontStyles();

  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={`${fontClasses} antialiased min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors`}
        style={fontVars}
      >
        {/* 로컬 폰트 @font-face 인라인 삽입 (localFonts가 비어있으면 렌더링 없음) */}
        {localFontStyles && (
          <style dangerouslySetInnerHTML={{ __html: localFontStyles }} />
        )}
        <Providers>
          <Navbar />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
