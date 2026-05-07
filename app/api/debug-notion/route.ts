import { NextResponse } from "next/server";

function cleanNotionId(raw: string): string {
  const match = raw.match(/([a-f0-9]{32})/);
  return match ? match[1] : raw.replace(/-/g, "");
}

export async function GET() {
  const raw = process.env.NOTION_PROJECTS_DATABASE_ID ?? "";
  const databaseId = cleanNotionId(raw);

  try {
    const res = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filter: { property: "태그", multi_select: { contains: "프로젝트" } },
        sorts: [{ timestamp: "last_edited_time", direction: "descending" }],
      }),
      cache: "no-store",
    });

    const response = await res.json();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sample = response.results?.slice(0, 3).map((page: any) => {
      const props = page.properties ?? {};
      const urlProp = props["URL"];
      return {
        title: props["이름"]?.title?.map((r: any) => r.plain_text).join("") ?? "",
        urlPropType: urlProp?.type ?? "없음",
        urlPropRaw: urlProp ?? null,
        urlPropValue:
          urlProp?.type === "url"
            ? urlProp.url
            : urlProp?.type === "rich_text"
            ? urlProp.rich_text?.map((r: any) => r.plain_text).join("").trim()
            : null,
      };
    });

    return NextResponse.json({ databaseId, total: response.results?.length, sample });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
