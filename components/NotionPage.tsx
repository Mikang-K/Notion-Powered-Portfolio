"use client";

import { NotionRenderer } from "react-notion-x";
import type { ExtendedRecordMap } from "notion-types";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { NotionErrorBoundary } from "./NotionErrorBoundary";

// react-notion-x 기본 스타일 (토글, 코드블록, 테이블 등 동작에 필수)
import "react-notion-x/src/styles.css";

// 선택적 컴포넌트 (코드 하이라이팅, 수식, 컬렉션 등)
const Code = dynamic(
  () => import("react-notion-x/build/third-party/code").then((m) => m.Code),
  { ssr: false }
);
const Collection = dynamic(
  () => import("react-notion-x/build/third-party/collection").then((m) => m.Collection),
  { ssr: false }
);
const Equation = dynamic(
  () => import("react-notion-x/build/third-party/equation").then((m) => m.Equation),
  { ssr: false }
);

interface NotionPageProps {
  recordMap: ExtendedRecordMap;
}

export function NotionPage({ recordMap }: NotionPageProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <NotionErrorBoundary>
    <div data-section="notion">
    <NotionRenderer
      recordMap={recordMap}
      fullPage={false}
      darkMode={mounted && resolvedTheme === "dark"}
      mapPageUrl={(pageId) => `/projects/${(pageId ?? "").replace(/-/g, "")}`}
      mapImageUrl={(url, block) => {
        if (!url) return "";
        const blockId = block?.id ?? "";

        // recordMap에 이미 signed URL이 있으면 우선 사용
        const signedUrl = recordMap.signed_urls?.[blockId];
        if (signedUrl) return signedUrl;

        // attachment: 스킴 — Notion 내부 파일 참조 (직접 접근 불가)
        if (url.startsWith("attachment:")) {
          return `/api/notion-image?url=${encodeURIComponent(url)}&blockId=${encodeURIComponent(blockId)}`;
        }

        // S3 서명 URL — 만료 방지를 위해 프록시 경유
        const isNotionFile =
          url.includes("prod-files-secure.s3") ||
          url.includes("secure.notion-static.com") ||
          url.includes("s3.us-west-2.amazonaws.com");
        if (isNotionFile) {
          return `/api/notion-image?url=${encodeURIComponent(url)}&blockId=${encodeURIComponent(blockId)}`;
        }

        return url;
      }}
      components={{
        nextImage: Image,
        nextLink: Link,
        Code,
        Collection,
        Equation,
      }}
    />
    </div>
    </NotionErrorBoundary>
  );
}
