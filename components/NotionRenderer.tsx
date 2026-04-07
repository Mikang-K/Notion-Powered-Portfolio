"use client";

import Image from "next/image";
import { useState } from "react";
import type { ExtendedRecordMap } from "notion-types";

// ─── Types ────────────────────────────────────────────────────────────────────

type Decoration = string[];
type RichText = ([string] | [string, Decoration[]])[];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type NotionBlock = any;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getImageSrc(url: string, blockId: string, recordMap: ExtendedRecordMap): string {
  if (!url) return "";
  const signedUrl = recordMap.signed_urls?.[blockId];
  if (signedUrl) return signedUrl;
  const needsProxy =
    url.startsWith("attachment:") ||
    url.includes("prod-files-secure.s3") ||
    url.includes("secure.notion-static.com") ||
    url.includes("s3.us-west-2.amazonaws.com");
  if (needsProxy) {
    return `/api/notion-image?url=${encodeURIComponent(url)}&blockId=${encodeURIComponent(blockId)}`;
  }
  return url;
}

// 연속된 리스트 블록을 그룹으로 묶기
type BlockGroup =
  | { type: "single"; id: string }
  | { type: "bulleted_list"; ids: string[] }
  | { type: "numbered_list"; ids: string[] };

function groupBlocks(ids: string[], recordMap: ExtendedRecordMap): BlockGroup[] {
  const groups: BlockGroup[] = [];
  for (const id of ids) {
    const blockType = recordMap.block[id]?.value?.type as string | undefined;
    if (blockType === "bulleted_list" || blockType === "numbered_list") {
      const last = groups[groups.length - 1];
      if (last && last.type === blockType) {
        last.ids.push(id);
      } else {
        groups.push({ type: blockType, ids: [id] });
      }
    } else {
      groups.push({ type: "single", id });
    }
  }
  return groups;
}

// ─── Rich Text ───────────────────────────────────────────────────────────────

function RichTextRenderer({ text }: { text: RichText | undefined }) {
  if (!text) return null;
  return (
    <>
      {text.map((segment, i) => {
        const [content, decorations = []] = segment as [string, Decoration[]?];
        if (content === "\n") return <br key={i} />;

        let cls = "";
        let href: string | undefined;
        let isCode = false;

        for (const dec of decorations) {
          switch (dec[0]) {
            case "b": cls += " font-semibold"; break;
            case "i": cls += " italic"; break;
            case "s": cls += " line-through"; break;
            case "u": cls += " underline underline-offset-2"; break;
            case "c": isCode = true; break;
            case "a": href = dec[1]; break;
          }
        }

        if (isCode) {
          return (
            <code key={i} className="bg-neutral-800 text-violet-300 px-1.5 py-0.5 rounded text-[0.85em] font-mono border border-neutral-700/60">
              {content}
            </code>
          );
        }
        if (href) {
          return (
            <a key={i} href={href} target="_blank" rel="noopener noreferrer"
              className={"text-violet-400 hover:text-violet-300 underline underline-offset-2 transition-colors" + cls}>
              {content}
            </a>
          );
        }
        return cls
          ? <span key={i} className={cls.trim()}>{content}</span>
          : <span key={i}>{content}</span>;
      })}
    </>
  );
}

// ─── Block Components ─────────────────────────────────────────────────────────

interface BlockProps {
  block: NotionBlock;
  recordMap: ExtendedRecordMap;
  level?: number;
}

function TextBlock({ block }: BlockProps) {
  const text: RichText = block.properties?.title;
  if (!text) return <div className="h-5" />;
  return (
    <p className="text-neutral-300 leading-[1.85] text-[1rem]">
      <RichTextRenderer text={text} />
    </p>
  );
}

function HeadingBlock({ block, recordMap, level = 1 }: BlockProps & { level?: number }) {
  const text: RichText = block.properties?.title;
  const children: string[] = block.content ?? [];
  const loadedChildren = children.filter((id) => recordMap.block[id]?.value);
  const [open, setOpen] = useState(false);

  const styles: Record<number, string> = {
    1: "text-2xl sm:text-3xl font-bold text-neutral-50 mt-12 mb-4",
    2: "text-xl sm:text-2xl font-semibold text-neutral-100 mt-10 mb-3",
    3: "text-lg sm:text-xl font-semibold text-neutral-200 mt-8 mb-2",
  };

  // 자식이 없는 일반 헤딩
  if (children.length === 0) {
    const Tag = (`h${level}`) as keyof JSX.IntrinsicElements;
    return (
      <Tag className={styles[level]}>
        <RichTextRenderer text={text} />
      </Tag>
    );
  }

  // 토글 헤딩
  return (
    <div className="my-2">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center gap-2.5 text-left group ${level === 1 ? "mt-12 mb-1" : level === 2 ? "mt-10 mb-1" : "mt-8 mb-1"}`}
      >
        <svg
          className={`w-3.5 h-3.5 shrink-0 text-neutral-500 transition-transform duration-200 ${open ? "rotate-90" : ""}`}
          viewBox="0 0 24 24" fill="currentColor"
        >
          <path d="M8 5v14l11-7z" />
        </svg>
        <span className={styles[level].replace(/mt-\d+\s?|mb-\d+\s?/g, "").trim()}>
          <RichTextRenderer text={text} />
        </span>
        <span className="text-xs text-neutral-600 ml-1 shrink-0">
          {loadedChildren.length}/{children.length}
        </span>
      </button>
      {open && (
        <div className="pl-6 mt-3 space-y-3 border-l border-neutral-800">
          {loadedChildren.length > 0 ? (
            groupBlocks(loadedChildren, recordMap).map((group, i) =>
              renderGroup(group, recordMap, i)
            )
          ) : (
            <p className="text-xs text-neutral-600 py-2">
              {children.length > 0
                ? `⚠ 자식 블록 ${children.length}개가 로드되지 않았습니다`
                : "내용 없음"}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function CodeBlock({ block }: BlockProps) {
  const text: RichText = block.properties?.title;
  const lang: RichText = block.properties?.language;
  const language = lang?.[0]?.[0] ?? "";
  const code = text?.map(([t]) => t).join("") ?? "";
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative my-2 rounded-xl overflow-hidden border border-neutral-800 bg-neutral-900/80">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-neutral-800 bg-neutral-900">
        <span className="text-xs text-neutral-500 font-mono uppercase tracking-wider">
          {language || "code"}
        </span>
        <button
          onClick={copy}
          className="text-xs text-neutral-500 hover:text-neutral-200 transition-colors flex items-center gap-1.5"
        >
          {copied ? (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              복사됨
            </>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              복사
            </>
          )}
        </button>
      </div>
      {/* Code */}
      <pre className="overflow-x-auto p-5 text-sm font-mono text-neutral-300 leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function ImageBlock({ block, recordMap }: BlockProps) {
  const src = block.properties?.source?.[0]?.[0] ?? "";
  const caption: RichText = block.properties?.caption;
  const resolvedSrc = getImageSrc(src, block.id, recordMap);

  if (!resolvedSrc) return null;

  return (
    <figure className="my-2">
      <div className="relative w-full rounded-xl overflow-hidden border border-neutral-800 bg-neutral-900">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={resolvedSrc}
          alt={caption?.map(([t]) => t).join("") || ""}
          className="w-full h-auto object-contain"
        />
      </div>
      {caption && caption.length > 0 && (
        <figcaption className="mt-2.5 text-center text-sm text-neutral-500">
          <RichTextRenderer text={caption} />
        </figcaption>
      )}
    </figure>
  );
}

function QuoteBlock({ block }: BlockProps) {
  const text: RichText = block.properties?.title;
  return (
    <blockquote className="border-l-2 border-violet-500 pl-5 py-1 my-2 text-neutral-400 italic leading-relaxed">
      <RichTextRenderer text={text} />
    </blockquote>
  );
}

function CalloutBlock({ block, recordMap }: BlockProps) {
  const text: RichText = block.properties?.title;
  const icon = block.format?.page_icon ?? "💡";
  const color = (block.format?.block_color as string) ?? "";

  const bgMap: Record<string, string> = {
    gray_background: "bg-neutral-800/50 border-neutral-700",
    blue_background: "bg-blue-950/40 border-blue-800/50",
    yellow_background: "bg-yellow-950/40 border-yellow-800/50",
    red_background: "bg-red-950/40 border-red-800/50",
    green_background: "bg-green-950/40 border-green-800/50",
    purple_background: "bg-violet-950/40 border-violet-800/50",
    pink_background: "bg-pink-950/40 border-pink-800/50",
    orange_background: "bg-orange-950/40 border-orange-800/50",
  };
  const bg = bgMap[color] ?? "bg-neutral-800/50 border-neutral-700";

  return (
    <div className={`flex gap-3.5 rounded-xl border p-5 my-2 ${bg}`}>
      <span className="text-xl shrink-0 mt-0.5">{icon}</span>
      <div className="text-neutral-300 leading-relaxed text-[0.95rem] flex-1">
        <RichTextRenderer text={text} />
        {(block.content ?? []).length > 0 && (
          <div className="mt-2 space-y-2">
            {groupBlocks(block.content ?? [], recordMap).map((group, i) =>
              renderGroup(group, recordMap, i)
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ToggleBlock({ block, recordMap }: BlockProps) {
  const [open, setOpen] = useState(false);
  const text: RichText = block.properties?.title;
  const children: string[] = block.content ?? [];
  // recordMap에 실제로 로드된 자식만 카운트
  const loadedChildren = children.filter((id) => recordMap.block[id]?.value);

  return (
    <div className="border border-neutral-800 rounded-xl overflow-hidden my-2">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-white/5 transition-colors"
      >
        <svg
          className={`w-3.5 h-3.5 shrink-0 text-neutral-500 transition-transform duration-200 ${open ? "rotate-90" : ""}`}
          viewBox="0 0 24 24" fill="currentColor"
        >
          <path d="M8 5v14l11-7z" />
        </svg>
        <span className="text-neutral-200 font-medium text-[0.95rem] flex-1">
          <RichTextRenderer text={text} />
        </span>
        {children.length > 0 && (
          <span className="text-xs text-neutral-600 ml-2 shrink-0">
            {loadedChildren.length}/{children.length}
          </span>
        )}
      </button>
      {open && (
        <div className="pl-12 pr-5 pb-5 space-y-3 border-t border-neutral-800/60">
          {loadedChildren.length > 0 ? (
            groupBlocks(loadedChildren, recordMap).map((group, i) =>
              renderGroup(group, recordMap, i)
            )
          ) : (
            <p className="text-xs text-neutral-600 py-2">
              {children.length > 0
                ? `⚠ 자식 블록 ${children.length}개가 로드되지 않았습니다`
                : "내용 없음"}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function DividerBlock() {
  return (
    <div className="my-8">
      <div className="h-px bg-gradient-to-r from-transparent via-neutral-700 to-transparent" />
    </div>
  );
}

function TodoBlock({ block, recordMap }: BlockProps) {
  const text: RichText = block.properties?.title;
  const checked = block.properties?.checked?.[0]?.[0] === "Yes";
  const children: string[] = block.content ?? [];

  return (
    <div className="flex items-start gap-3 my-1">
      <span className={`mt-1 w-4 h-4 shrink-0 rounded flex items-center justify-center border ${checked ? "bg-violet-600 border-violet-600" : "border-neutral-600 bg-transparent"}`}>
        {checked && (
          <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </span>
      <div className={`flex-1 leading-relaxed ${checked ? "line-through text-neutral-500" : "text-neutral-300"}`}>
        <RichTextRenderer text={text} />
        {children.length > 0 && (
          <div className="mt-2 space-y-1 pl-2">
            {groupBlocks(children, recordMap).map((group, i) =>
              renderGroup(group, recordMap, i)
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function BookmarkBlock({ block }: BlockProps) {
  const url = block.properties?.link?.[0]?.[0] ?? "";
  const title: RichText = block.properties?.title;
  const description: RichText = block.properties?.description;
  if (!url) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-start gap-4 p-4 my-2 rounded-xl border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-800/60 transition-colors no-underline group"
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-neutral-200 group-hover:text-violet-400 transition-colors truncate">
          {title ? <RichTextRenderer text={title} /> : url}
        </p>
        {description && (
          <p className="text-xs text-neutral-500 mt-1 line-clamp-2">
            <RichTextRenderer text={description} />
          </p>
        )}
        <p className="text-xs text-neutral-600 mt-1.5 truncate">{url}</p>
      </div>
      <svg className="w-4 h-4 shrink-0 text-neutral-600 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        <polyline points="15 3 21 3 21 9" />
        <line x1="10" y1="14" x2="21" y2="3" />
      </svg>
    </a>
  );
}

function VideoBlock({ block }: BlockProps) {
  const src = block.properties?.source?.[0]?.[0] ?? "";
  const caption: RichText = block.properties?.caption;
  if (!src) return null;

  // YouTube embed
  const youtubeMatch = src.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (youtubeMatch) {
    return (
      <figure className="my-2">
        <div className="relative w-full rounded-xl overflow-hidden border border-neutral-800 bg-neutral-900" style={{ paddingBottom: "56.25%" }}>
          <iframe
            src={`https://www.youtube.com/embed/${youtubeMatch[1]}`}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        {caption && (
          <figcaption className="mt-2 text-center text-sm text-neutral-500">
            <RichTextRenderer text={caption} />
          </figcaption>
        )}
      </figure>
    );
  }

  return (
    <figure className="my-2">
      <video src={src} controls className="w-full rounded-xl border border-neutral-800" />
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-neutral-500">
          <RichTextRenderer text={caption} />
        </figcaption>
      )}
    </figure>
  );
}

function TableBlock({ block, recordMap }: BlockProps) {
  const rowIds: string[] = block.content ?? [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hasColHeader: boolean = (block.format as any)?.table_block_column_header ?? false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hasRowHeader: boolean = (block.format as any)?.table_block_row_header ?? false;
  // 컬럼 순서: 첫 번째 row에서 property 키 순서를 얻는다
  const firstRow = rowIds[0] ? recordMap.block[rowIds[0]]?.value : null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const colOrder: string[] = (block.format as any)?.table_block_column_order ??
    (firstRow ? Object.keys(firstRow.properties ?? {}) : []);

  if (rowIds.length === 0 || colOrder.length === 0) return null;

  return (
    <div className="my-4 overflow-x-auto rounded-xl border border-neutral-800">
      <table className="w-full text-sm text-neutral-300 border-collapse">
        <tbody>
          {rowIds.map((rowId, rowIndex) => {
            const rowBlock = recordMap.block[rowId]?.value;
            if (!rowBlock) return null;
            const isHeader = hasColHeader && rowIndex === 0;
            const Tag = isHeader ? "th" : "td";

            return (
              <tr key={rowId} className={isHeader
                ? "bg-neutral-800/80 text-neutral-100 font-semibold"
                : rowIndex % 2 === 0 ? "bg-neutral-900/40" : "bg-neutral-900/20"}>
                {colOrder.map((colId, colIndex) => {
                  const cellText: RichText = rowBlock.properties?.[colId];
                  const isRowHeader = hasRowHeader && colIndex === 0;
                  return (
                    <Tag
                      key={colId}
                      className={`px-4 py-2.5 border border-neutral-800 text-left align-top ${isRowHeader ? "font-semibold text-neutral-100 bg-neutral-800/60" : ""}`}
                    >
                      {cellText ? <RichTextRenderer text={cellText} /> : null}
                    </Tag>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// 지원하지 않는 블록 타입: title 속성이 있으면 텍스트만 표시 (내용 유실 방지)
function FallbackBlock({ block }: BlockProps) {
  const text: RichText = block.properties?.title;
  if (!text) return null;
  return (
    <p className="text-neutral-400 leading-relaxed text-[0.95rem] italic">
      <RichTextRenderer text={text} />
    </p>
  );
}

function BulletedListGroup({ ids, recordMap }: { ids: string[]; recordMap: ExtendedRecordMap }) {
  return (
    <ul className="space-y-2 my-2">
      {ids.map((id) => {
        const block = recordMap.block[id]?.value;
        const text: RichText = block?.properties?.title;
        const children: string[] = block?.content ?? [];
        return (
          <li key={id} className="flex gap-3 text-neutral-300 leading-relaxed">
            <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-violet-500 shrink-0" />
            <div className="flex-1">
              <RichTextRenderer text={text} />
              {children.length > 0 && (
                <div className="mt-2 space-y-2 pl-2">
                  {groupBlocks(children, recordMap).map((group, i) =>
                    renderGroup(group, recordMap, i)
                  )}
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function NumberedListGroup({ ids, recordMap }: { ids: string[]; recordMap: ExtendedRecordMap }) {
  return (
    <ol className="space-y-2 my-2">
      {ids.map((id, index) => {
        const block = recordMap.block[id]?.value;
        const text: RichText = block?.properties?.title;
        const children: string[] = block?.content ?? [];
        return (
          <li key={id} className="flex gap-3 text-neutral-300 leading-relaxed">
            <span className="text-violet-500 font-mono text-sm font-semibold shrink-0 mt-0.5 min-w-[1.25rem] text-right">
              {index + 1}.
            </span>
            <div className="flex-1">
              <RichTextRenderer text={text} />
              {children.length > 0 && (
                <div className="mt-2 space-y-2 pl-2">
                  {groupBlocks(children, recordMap).map((group, i) =>
                    renderGroup(group, recordMap, i)
                  )}
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function ColumnListBlock({ block, recordMap }: BlockProps) {
  const columns: string[] = block.content ?? [];
  return (
    <div className={`grid gap-6 my-2`} style={{ gridTemplateColumns: `repeat(${columns.length}, 1fr)` }}>
      {columns.map((colId) => {
        const colBlock = recordMap.block[colId]?.value;
        const colContent: string[] = colBlock?.content ?? [];
        return (
          <div key={colId} className="space-y-4">
            {groupBlocks(colContent, recordMap).map((group, i) =>
              renderGroup(group, recordMap, i)
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Block Dispatcher ─────────────────────────────────────────────────────────

function BlockRenderer({ blockId, recordMap, level = 0 }: { blockId: string; recordMap: ExtendedRecordMap; level?: number }) {
  const block = recordMap.block[blockId]?.value as NotionBlock;
  if (!block) return null;

  switch (block.type) {
    case "text":
      return <TextBlock block={block} recordMap={recordMap} level={level} />;
    case "header":
      return <HeadingBlock block={block} recordMap={recordMap} level={1} />;
    case "sub_header":
      return <HeadingBlock block={block} recordMap={recordMap} level={2} />;
    case "sub_sub_header":
      return <HeadingBlock block={block} recordMap={recordMap} level={3} />;
    case "code":
      return <CodeBlock block={block} recordMap={recordMap} level={level} />;
    case "image":
      return <ImageBlock block={block} recordMap={recordMap} level={level} />;
    case "quote":
      return <QuoteBlock block={block} recordMap={recordMap} level={level} />;
    case "callout":
      return <CalloutBlock block={block} recordMap={recordMap} level={level} />;
    case "toggle":
      return <ToggleBlock block={block} recordMap={recordMap} level={level} />;
    case "divider":
      return <DividerBlock />;
    case "column_list":
      return <ColumnListBlock block={block} recordMap={recordMap} level={level} />;
    case "to_do":
      return <TodoBlock block={block} recordMap={recordMap} level={level} />;
    case "bookmark":
      return <BookmarkBlock block={block} recordMap={recordMap} level={level} />;
    case "video":
      return <VideoBlock block={block} recordMap={recordMap} level={level} />;
    case "table":
      return <TableBlock block={block} recordMap={recordMap} level={level} />;
    case "table_row":
      // table_row는 TableBlock 내부에서 처리 — 단독으로 오면 무시
      return null;
    // 렌더러가 없는 타입은 title 텍스트라도 표시 (내용 유실 방지)
    default:
      return <FallbackBlock block={block} recordMap={recordMap} level={level} />;
  }
}

function renderGroup(group: BlockGroup, recordMap: ExtendedRecordMap, key: number) {
  if (group.type === "bulleted_list") {
    return <BulletedListGroup key={key} ids={group.ids} recordMap={recordMap} />;
  }
  if (group.type === "numbered_list") {
    return <NumberedListGroup key={key} ids={group.ids} recordMap={recordMap} />;
  }
  return <BlockRenderer key={key} blockId={group.id} recordMap={recordMap} />;
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export function NotionRenderer({ recordMap }: { recordMap: ExtendedRecordMap }) {
  // 페이지 루트 블록의 children 추출
  const pageBlock = Object.values(recordMap.block).find(
    (b) => b?.value?.type === "page"
  );
  const contentIds: string[] = pageBlock?.value?.content ?? [];
  const groups = groupBlocks(contentIds, recordMap);

  return (
    <div className="space-y-5">
      {groups.map((group, i) => renderGroup(group, recordMap, i))}
    </div>
  );
}
