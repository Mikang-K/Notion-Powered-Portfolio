import { Client } from "@notionhq/client";
import { NextResponse } from "next/server";

export async function GET() {
  const raw = process.env.NOTION_PROJECTS_DATABASE_ID ?? "";
  const match = raw.match(/([a-f0-9]{32})/);
  const databaseId = match ? match[1] : raw.replace(/-/g, "");

  const notionOfficial = new Client({ auth: process.env.NOTION_TOKEN });

  try {
    const response = await notionOfficial.dataSources.query({
      data_source_id: databaseId,
    });

    const sample = response.results.slice(0, 2).map((page) => ({
      id: page.id,
      object: page.object,
      propertyKeys: "properties" in page ? Object.keys(page.properties) : [],
      propertyTypes: "properties" in page
        ? Object.fromEntries(
            Object.entries(page.properties).map(([k, v]) => [k, { type: (v as any).type, value: v }])
          )
        : {},
    }));

    return NextResponse.json({
      databaseId,
      total: response.results.length,
      sample,
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
