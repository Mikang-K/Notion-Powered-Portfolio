"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/lib/types";

const statusColors = {
  "In Progress": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  Completed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Archived: "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400",
};

interface ProjectCardProps {
  project: Project;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link
        href={`/projects/${project.slug}`}
        className="group block h-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden hover:border-neutral-400 dark:hover:border-neutral-600 hover:shadow-lg transition-all duration-300"
      >
        {/* Thumbnail */}
        <div className="relative h-48 bg-gradient-to-br from-violet-500/20 to-indigo-500/20 dark:from-violet-500/10 dark:to-indigo-500/10">
          {project.thumbnail ? (
            <Image
              src={project.thumbnail}
              alt={project.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <NotionIcon />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors line-clamp-1">
              {project.title}
            </h3>
            <span
              className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[project.status]}`}
            >
              {project.status}
            </span>
          </div>

          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 line-clamp-2">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-1.5">
            {project.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
              >
                {tag}
              </span>
            ))}
            {project.tags.length > 4 && (
              <span className="text-xs px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-500">
                +{project.tags.length - 4}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function NotionIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="opacity-30">
      <path
        d="M4 4h16v16H4V4z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 9h6M9 12h6M9 15h4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
