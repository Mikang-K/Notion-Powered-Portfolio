/**
 * 폰트 설정 파일
 * ─────────────────────────────────────────────────────────
 * 빌트인 폰트 키 (Google Fonts, 자동 로드됨):
 *
 *   sans(본문):  "geist-sans" | "inter" | "noto-sans-kr" | "noto-serif-kr"
 *   mono(코드):  "geist-mono" | "jetbrains-mono"
 *
 * 커스텀 폰트 추가 방법:
 *   - webFonts   : URL(@font-face)로 로드하는 CDN/외부 폰트
 *   - localFonts : 방문자 기기에 설치된 시스템 폰트
 *   등록 후 name 값을 global / sections 의 폰트 키로 사용합니다.
 * ─────────────────────────────────────────────────────────
 */
export const fontConfig = {
  /**
   * URL로 로드하는 웹 폰트 등록 (@font-face url(...))
   *
   * 예시:
   * {
   *   name: "mabiyet",          ← font-config 에서 사용할 키
   *   family: "Mabiyet",        ← CSS font-family 이름 (자유롭게 지정)
   *   src: [
   *     { url: "https://cdn.../font.woff2", format: "woff2" },
   *     { url: "https://cdn.../font.woff",  format: "woff"  },  ← 폴백 (선택)
   *   ],
   *   weight: "normal",         ← 생략 시 "normal"
   *   style: "normal",          ← 생략 시 "normal"
   * }
   */
  webFonts: [
    {
      name: "mabiyet",
      family: "Mabiyet",
      src: [
        {
          url: "https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2207-01@1.0/MabinogiClassicR.woff2",
          format: "woff2",
        },
      ],
    },
  ] as Array<{
    name: string;
    family: string;
    src: Array<{ url: string; format: string }>;
    weight?: string;
    style?: string;
  }>,

  /**
   * 방문자 기기에 설치된 시스템 폰트 등록 (@font-face local(...))
   * ※ 방문자 기기에 폰트가 없으면 폴백 폰트로 표시됩니다.
   */
  localFonts: [
    // 예시:
    // { name: "pretendard", family: ["Pretendard Variable", "Pretendard"] },
  ] as Array<{
    name: string;
    family: string | string[];
  }>,

  /** 전체 기본 폰트 */
  global: {
    sans: "mabiyet", // 본문
    mono: "geist-mono",   // 코드 블록
  },

  /** 섹션별 개별 폰트 (null = global 폰트 사용) */
  sections: {
    hero:     null as string | null,
    navbar:   null as string | null,
    projects: null as string | null,
    skills:   null as string | null,
    notion:   null as string | null,
  },
};
