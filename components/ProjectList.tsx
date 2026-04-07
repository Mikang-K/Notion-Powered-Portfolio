import { ProjectCard } from "./ProjectCard";
import type { Project } from "@/lib/types";

interface ProjectListProps {
  projects: Project[];
}

export function ProjectList({ projects }: ProjectListProps) {
  return (
    <section id="projects" data-section="projects" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
          Projects
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400 mb-12">
          노션으로 관리되는 프로젝트 목록입니다.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-20 text-neutral-400">
            <p>프로젝트가 없습니다.</p>
            <p className="text-sm mt-1">.env.local에 노션 설정을 추가하세요.</p>
          </div>
        )}
      </div>
    </section>
  );
}
