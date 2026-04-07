import { NotionAPI } from "notion-client";
import { Client } from "@notionhq/client";
import type { ExtendedRecordMap } from "notion-types";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints/common";
import type { RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints/common";
import type { Project } from "./types";

// ─── notion-client: 개별 페이지 렌더링용 (token_v2 사용) ─────────────────────
const tokenV2 = process.env.NOTION_TOKEN_V2
  ? decodeURIComponent(process.env.NOTION_TOKEN_V2)
  : undefined;

export const notion = new NotionAPI({ authToken: tokenV2 });

// ─── @notionhq/client: 데이터베이스 쿼리용 (인테그레이션 토큰 사용) ───────────
const notionOfficial = new Client({ auth: process.env.NOTION_TOKEN });

function cleanNotionId(raw: string): string {
  const match = raw.match(/([a-f0-9]{32})/);
  return match ? match[1] : raw.replace(/-/g, "");
}

// 노션 페이지 전체 블록 데이터 조회 (react-notion-x 렌더링용)
export async function getNotionPage(pageId: string): Promise<ExtendedRecordMap> {
  const recordMap = await notion.getPage(cleanNotionId(pageId));

  // Notion 내부 API 구조 변경 대응:
  // 신규 형식: block[id].value = { value: Block, role: string } (중첩)
  // 구형식:   block[id].value = Block (직접)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function unwrapEntry(entry: any) {
    const inner = entry?.value?.value;
    if (inner?.id) return { ...entry, value: inner };
    return entry;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cleanBlock: Record<string, any> = Object.fromEntries(
    Object.entries(recordMap.block).map(([id, entry]) => [id, unwrapEntry(entry)])
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function fetchBlocks(ids: string[]): Promise<Record<string, any>> {
    if (ids.length === 0) return {};
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res = await (notion as any).getBlocks(ids);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return res?.recordMap?.block ?? {};
    } catch {
      return {};
    }
  }

  // Step 1: collapsed 토글의 content 배열은 loadPageChunk에서 빈 배열로 오는 경우가 있음.
  // 토글 블록을 syncRecordValues로 다시 조회해 실제 content 배열을 얻는다.
  const toggleIds = Object.entries(cleanBlock)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .filter(([, e]) => (e as any)?.value?.type === "toggle")
    .map(([id]) => id);

  if (toggleIds.length > 0) {
    const freshToggleBlocks = await fetchBlocks(toggleIds);
    for (const [id, entry] of Object.entries(freshToggleBlocks)) {
      cleanBlock[id] = unwrapEntry(entry);
    }
  }

  // Step 2: 모든 블록의 content 배열을 BFS로 순회하며 누락된 자식 블록을 수집.
  // (토글·콜아웃·컬럼 등 중첩 구조 전체를 커버)
  const MAX_ROUNDS = 5;
  for (let round = 0; round < MAX_ROUNDS; round++) {
    const missingIds = new Set<string>();
    for (const [, entry] of Object.entries(cleanBlock)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const children: string[] = (entry as any)?.value?.content ?? [];
      for (const childId of children) {
        if (!cleanBlock[childId]) missingIds.add(childId);
      }
    }
    if (missingIds.size === 0) break;

    const fetched = await fetchBlocks([...missingIds]);
    let added = false;
    for (const [id, entry] of Object.entries(fetched)) {
      if (!cleanBlock[id]) {
        cleanBlock[id] = unwrapEntry(entry);
        added = true;
      }
    }
    if (!added) break;
  }

  return { ...recordMap, block: cleanBlock };
}

// 노션 데이터베이스에서 프로젝트 목록 조회 (공식 API 사용)
export async function getProjects(): Promise<Project[]> {
  const raw = process.env.NOTION_PROJECTS_DATABASE_ID;
  if (!raw) {
    console.warn("NOTION_PROJECTS_DATABASE_ID is not set. Using mock data.");
    return getMockProjects();
  }

  try {
    const databaseId = cleanNotionId(raw);
    const res = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filter: {
          property: "태그",
          multi_select: {
            contains: "프로젝트",
          },
        },
        sorts: [{ timestamp: "last_edited_time", direction: "descending" }],
      }),
    });
    if (!res.ok) throw new Error(await res.text());
    const response = await res.json();

    const projects = response.results
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .filter((p: any): p is PageObjectResponse => p.object === "page" && "properties" in p)
      .map((page: PageObjectResponse) => {
        const props = page.properties;

        const title = getRichText(props["이름"]);
        const description = getRichText(props["소개"]);
        const tags = getMultiSelect(props["태그"]);
        const date = getDate(props["일자"]);
        const status = (getSelect(props["상태"]) || "Completed") as Project["status"];
        const thumbnail = getCover(page);

        return {
          id: page.id,
          title: title || "Untitled",
          description,
          tags,
          thumbnail,
          slug: page.id.replace(/-/g, ""),
          date: date || page.created_time.split("T")[0],
          status,
        } satisfies Project;
      });

    return projects.length > 0 ? projects : getMockProjects();
  } catch (error) {
    console.error("Failed to fetch projects from Notion:", error);
    return getMockProjects();
  }
}

// ─── 공식 API 속성 파싱 헬퍼 ───────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type NotionProperty = any;

function getRichText(prop: NotionProperty | undefined): string {
  if (!prop) return "";
  if (prop.type === "title") return prop.title.map((r: RichTextItemResponse) => r.plain_text).join("");
  if (prop.type === "rich_text") return prop.rich_text.map((r: RichTextItemResponse) => r.plain_text).join("");
  return "";
}

function getSelect(prop: NotionProperty | undefined): string {
  if (!prop || prop.type !== "select") return "";
  return prop.select?.name ?? "";
}

function getMultiSelect(prop: NotionProperty | undefined): string[] {
  if (!prop || prop.type !== "multi_select") return [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return prop.multi_select.map((s: any) => s.name as string);
}

function getDate(prop: NotionProperty | undefined): string {
  if (!prop || prop.type !== "date") return "";
  return prop.date?.start ?? "";
}

function getCover(page: PageObjectResponse): string | null {
  const cover = page.cover;
  if (!cover) return null;
  if (cover.type === "external") return cover.external.url;
  if (cover.type === "file") return cover.file.url;
  return null;
}

function getMockProjects(): Project[] {
  return [
    {
      id: "mock-1",
      title: "Notion-Powered Portfolio",
      description: "노션을 CMS로 활용한 개인 포트폴리오 사이트. Next.js + react-notion-x 기반.",
      tags: ["Next.js", "Notion", "TypeScript", "Tailwind CSS"],
      thumbnail: null,
      slug: "notion-powered-portfolio",
      date: "2026-04-06",
      status: "In Progress",
    },
    {
      id: "mock-2",
      title: "Sample Project",
      description: "노션 데이터베이스를 연결하면 실제 프로젝트가 표시됩니다.",
      tags: ["React", "Node.js"],
      thumbnail: null,
      slug: "sample-project",
      date: "2026-01-01",
      status: "Completed",
    },
  ];
}
