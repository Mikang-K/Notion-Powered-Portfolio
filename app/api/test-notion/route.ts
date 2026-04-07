import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("mode") ?? "projects";

  // ── 1) 프로젝트 목록 테스트 ──────────────────────────────────────────────
  if (mode === "projects") {
    const raw = process.env.NOTION_PROJECTS_DATABASE_ID ?? "";
    const match = raw.match(/([a-f0-9]{32})/);
    const databaseId = match ? match[1] : raw.replace(/-/g, "");

    try {
      const res = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
          "Notion-Version": "2022-06-28",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });
      const response = await res.json();
      if (!res.ok) return NextResponse.json({ ok: false, error: response }, { status: res.status });

      return NextResponse.json({
        ok: true,
        source: "notion",
        count: response.results.length,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        projects: response.results.slice(0, 3).map((p: any) => ({
          id: p.id,
          properties: p.properties ? Object.keys(p.properties) : [],
        })),
      });
    } catch (err) {
      return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
    }
  }

  // ── 2) 개별 페이지 블록 테스트 (?mode=page&id=<pageId>) ──────────────────
  if (mode === "page") {
    const pageId = searchParams.get("id");
    if (!pageId) {
      return NextResponse.json(
        { ok: false, error: "?id=<pageId> 파라미터가 필요합니다." },
        { status: 400 }
      );
    }

    try {
      // 필터 없이 notion-client 원본 데이터를 직접 확인
      const { notion: notionClient } = await import("@/lib/notion");
      const raw = pageId.match(/([a-f0-9]{32})/)?.[1] ?? pageId.replace(/-/g, "");
      const recordMap = await notionClient.getPage(raw);
      const blockIds = Object.keys(recordMap.block);
      const withId = blockIds.filter((id) => recordMap.block[id]?.value?.id);
      const withoutId = blockIds.filter((id) => !recordMap.block[id]?.value?.id);

      return NextResponse.json({
        ok: true,
        resolvedPageId: raw,
        totalBlocks: blockIds.length,
        blocksWithId: withId.length,
        blocksWithoutId: withoutId.length,
        allBlockTypes: blockIds.map((id) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const v = recordMap.block[id]?.value as any;
          const inner = v?.value ?? v;
          return { id, type: inner?.type ?? null, hasContent: Array.isArray(inner?.content) && inner.content.length > 0, contentCount: inner?.content?.length ?? 0 };
        }),
      });
    } catch (err) {
      return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
    }
  }

  // ── 3) 환경변수 존재 여부 확인 (?mode=env) ────────────────────────────────
  if (mode === "env") {
    return NextResponse.json({
      ok: true,
      NOTION_TOKEN: !!process.env.NOTION_TOKEN,
      NOTION_TOKEN_V2: !!process.env.NOTION_TOKEN_V2,
      NOTION_PROJECTS_DATABASE_ID: !!process.env.NOTION_PROJECTS_DATABASE_ID,
    });
  }

  return NextResponse.json(
    { ok: false, error: "mode는 projects | page | env 중 하나여야 합니다." },
    { status: 400 }
  );
}
