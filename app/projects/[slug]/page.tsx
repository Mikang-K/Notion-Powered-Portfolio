import { notFound } from "next/navigation";
import Link from "next/link";
import { getProjects, getNotionPage } from "@/lib/notion";
import { NotionRenderer } from "@/components/NotionRenderer";

export const revalidate = 3600;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const projects = await getProjects();
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: `${project.title} | Portfolio`,
    description: project.description,
  };
}

const statusColors = {
  "In Progress": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  Completed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Archived: "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400",
};

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const projects = await getProjects();
  const project = projects.find((p) => p.slug === slug);

  if (!project) notFound();

  const isMock = project.id.startsWith("mock-");
  let recordMap = null;
  if (!isMock) {
    try {
      recordMap = await getNotionPage(project.id);
    } catch {
      // 페이지 로드 실패 시 fallback
    }
  }

  return (
    <div className="min-h-screen pt-14 lg:flex">

      {/* ── Sidebar (PC: 화면 왼쪽 고정) ── */}
      <aside className="hidden lg:flex lg:flex-col lg:w-56 xl:w-64 lg:shrink-0 lg:sticky lg:top-14 lg:h-[calc(100vh-3.5rem)] lg:overflow-y-auto border-r border-neutral-200 dark:border-neutral-800">
        <div className="flex flex-col gap-8 px-6 py-10">
          {/* Back */}
          <Link
            href="/#projects"
            className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Back to projects
          </Link>

          {/* Status */}
          <div>
            <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-2">Status</p>
            <span className={`inline-block text-xs px-3 py-1 rounded-full font-medium ${statusColors[project.status]}`}>
              {project.status}
            </span>
          </div>

          {/* Date */}
          {project.date && (
            <div>
              <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-2">Date</p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">{project.date}</p>
            </div>
          )}

          {/* Tags */}
          {project.tags.length > 0 && (
            <div>
              <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-3">Tags</p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-1 rounded-md bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* ── Main content (나머지 전체 영역) ── */}
      <main className="flex-1 min-w-0">
        <div className="px-4 sm:px-8 lg:px-12 xl:px-16 py-12">

          {/* Back — mobile only */}
          <Link
            href="/#projects"
            className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors mb-8 lg:hidden"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Back to projects
          </Link>

          {/* Header */}
          <header className="mb-10 pb-10 border-b border-neutral-200 dark:border-neutral-800">
            {/* Tags — mobile */}
            <div className="flex flex-wrap gap-2 mb-4 lg:hidden">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-1 rounded-md bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400"
                >
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 dark:text-neutral-100 mb-4 leading-tight">
              {project.title}
            </h1>
            <p className="text-lg lg:text-xl text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {project.description}
            </p>

            {/* Status + Date — mobile */}
            <div className="flex items-center gap-4 mt-5 lg:hidden">
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColors[project.status]}`}>
                {project.status}
              </span>
              {project.date && (
                <p className="text-sm text-neutral-400">{project.date}</p>
              )}
            </div>
          </header>

          {/* Notion Content */}
          <div className="notion-content-wrapper">
            {recordMap ? (
              <NotionRenderer recordMap={recordMap} />
            ) : (
              <div className="text-center py-20 text-neutral-400 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl">
                <p className="font-medium mb-1">노션 콘텐츠를 불러올 수 없습니다</p>
                <p className="text-sm">.env.local에 NOTION_TOKEN을 설정하면 노션 페이지가 렌더링됩니다.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
