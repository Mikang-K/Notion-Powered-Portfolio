"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { Project } from "@/lib/types";

interface ProjectCardProps {
  project: Project;
  index: number;
}

const CARD_COLORS = [
  {
    headerBg: "bg-emerald-50 dark:bg-emerald-950/40",
    hoverBorder: "hover:border-emerald-300 dark:hover:border-emerald-700",
    titleHover: "group-hover:text-emerald-600 dark:group-hover:text-emerald-400",
    tagBg: "bg-emerald-100 dark:bg-emerald-900/30",
    tagText: "text-emerald-700 dark:text-emerald-300",
    linkHover: "hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:border-emerald-300 dark:hover:border-emerald-700",
  },
  {
    headerBg: "bg-teal-50 dark:bg-teal-950/40",
    hoverBorder: "hover:border-teal-300 dark:hover:border-teal-700",
    titleHover: "group-hover:text-teal-600 dark:group-hover:text-teal-400",
    tagBg: "bg-teal-100 dark:bg-teal-900/30",
    tagText: "text-teal-700 dark:text-teal-300",
    linkHover: "hover:text-teal-600 dark:hover:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/30 hover:border-teal-300 dark:hover:border-teal-700",
  },
  {
    headerBg: "bg-cyan-50 dark:bg-cyan-950/40",
    hoverBorder: "hover:border-cyan-300 dark:hover:border-cyan-700",
    titleHover: "group-hover:text-cyan-600 dark:group-hover:text-cyan-400",
    tagBg: "bg-cyan-100 dark:bg-cyan-900/30",
    tagText: "text-cyan-700 dark:text-cyan-300",
    linkHover: "hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-900/30 hover:border-cyan-300 dark:hover:border-cyan-700",
  },
  {
    headerBg: "bg-slate-100 dark:bg-slate-800/60",
    hoverBorder: "hover:border-slate-400 dark:hover:border-slate-500",
    titleHover: "group-hover:text-slate-700 dark:group-hover:text-slate-300",
    tagBg: "bg-slate-200 dark:bg-slate-700/50",
    tagText: "text-slate-700 dark:text-slate-300",
    linkHover: "hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:border-slate-400 dark:hover:border-slate-500",
  },
  {
    headerBg: "bg-stone-100 dark:bg-stone-800/60",
    hoverBorder: "hover:border-stone-400 dark:hover:border-stone-500",
    titleHover: "group-hover:text-stone-700 dark:group-hover:text-stone-300",
    tagBg: "bg-stone-200 dark:bg-stone-700/50",
    tagText: "text-stone-700 dark:text-stone-300",
    linkHover: "hover:text-stone-700 dark:hover:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700/50 hover:border-stone-400 dark:hover:border-stone-500",
  },
  {
    headerBg: "bg-green-50 dark:bg-green-950/40",
    hoverBorder: "hover:border-green-300 dark:hover:border-green-700",
    titleHover: "group-hover:text-green-600 dark:group-hover:text-green-400",
    tagBg: "bg-green-100 dark:bg-green-900/30",
    tagText: "text-green-700 dark:text-green-300",
    linkHover: "hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 hover:border-green-300 dark:hover:border-green-700",
  },
];

export function ProjectCard({ project, index }: ProjectCardProps) {
  const colors = CARD_COLORS[index % CARD_COLORS.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link
        href={`/projects/${project.slug}`}
        className={`group flex flex-col rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden ${colors.hoverBorder} hover:shadow-lg transition-all duration-300`}
      >
        {/* 제목 영역 */}
        <div className={`flex items-start justify-between gap-3 px-5 py-4 ${colors.headerBg}`}>
          <h3 className={`font-semibold text-neutral-900 dark:text-neutral-100 ${colors.titleHover} transition-colors leading-snug`}>
            {project.title}
          </h3>
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className={`shrink-0 flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-white dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-600 ${colors.linkHover} transition-all duration-200`}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
              Link
            </a>
          )}
        </div>

        {/* 소개 + 태그 영역 */}
        <div className="flex flex-col gap-3 px-5 py-4 bg-white dark:bg-neutral-900">
          {project.description && (
            <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
              {project.description}
            </p>
          )}
          <div className="flex flex-wrap gap-1.5">
            {project.tags.slice(0, 5).map((tag) => (
              <span
                key={tag}
                className={`text-xs px-2 py-0.5 rounded-md ${colors.tagBg} ${colors.tagText}`}
              >
                {tag}
              </span>
            ))}
            {project.tags.length > 5 && (
              <span className={`text-xs px-2 py-0.5 rounded-md ${colors.tagBg} ${colors.tagText} opacity-70`}>
                +{project.tags.length - 5}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
