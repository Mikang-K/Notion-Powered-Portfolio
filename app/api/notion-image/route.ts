import { NextRequest, NextResponse } from "next/server";
import { notion } from "@/lib/notion";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const encodedUrl = request.nextUrl.searchParams.get("url");
  if (!encodedUrl) {
    return new NextResponse("Missing url parameter", { status: 400 });
  }

  const url = decodeURIComponent(encodedUrl);
  const blockId = request.nextUrl.searchParams.get("blockId") ?? "";
  let finalUrl = url;

  const needsSigning =
    url.startsWith("attachment:") ||
    url.includes("prod-files-secure.s3") ||
    url.includes("secure.notion-static.com") ||
    url.includes("s3.us-west-2.amazonaws.com");

  if (needsSigning) {
    try {
      const signed = await notion.getSignedFileUrls([
        { url, permissionRecord: { table: "block", id: blockId } },
      ]);
      if (signed.signedUrls?.[0]) {
        finalUrl = signed.signedUrls[0];
      }
    } catch {
      // 재발급 실패 시 원본 URL 그대로 시도 (attachment: 는 이 경우 실패함)
    }
  }

  // attachment: 스킴은 서명 후에도 HTTP URL이 아닐 경우 빈 이미지 반환
  if (!finalUrl.startsWith("http")) {
    return new NextResponse("Cannot resolve image URL", { status: 404 });
  }

  try {
    const res = await fetch(finalUrl, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    if (!res.ok) {
      return new NextResponse("Image fetch failed", { status: res.status });
    }

    const buffer = await res.arrayBuffer();
    const contentType = res.headers.get("content-type") ?? "image/jpeg";

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=3600",
      },
    });
  } catch (e) {
    console.error("[notion-image proxy] error:", e);
    return new NextResponse("Proxy error", { status: 500 });
  }
}
