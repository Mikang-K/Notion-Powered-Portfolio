"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const SIDEBAR_CONFIG = {
  name: "백진명",
  title: "Frontend Developer",
  profileImage: "/profile.jpg",
  contact: {
    email: "qorwlsaud1@gmail.com",
    github: "https://github.com/Mikang87",
    blog: "",
  },
};

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  );
}

export function Sidebar() {
  const [imgError, setImgError] = useState(false);
  const { name, title, profileImage, contact } = SIDEBAR_CONFIG;

  const initials = name
    .split("")
    .filter((c) => /[A-Z가-힣]/.test(c))
    .slice(0, 2)
    .join("");

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:shrink-0 lg:sticky lg:top-14 lg:h-[calc(100vh-3.5rem)] lg:overflow-y-auto border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-8 py-10">
      {/* 프로필 이미지 */}
      <div className="flex flex-col items-center gap-4 mb-8">
        {!imgError && profileImage ? (
          <div className="relative w-24 h-24 rounded-full overflow-hidden ring-2 ring-violet-500 ring-offset-2 ring-offset-white dark:ring-offset-neutral-950">
            <Image
              src={profileImage}
              alt={name}
              fill
              className="object-cover"
              onError={() => setImgError(true)}
            />
          </div>
        ) : (
          <div className="w-24 h-24 rounded-full ring-2 ring-violet-500 ring-offset-2 ring-offset-white dark:ring-offset-neutral-950 bg-gradient-to-br from-violet-500 via-fuchsia-500 to-indigo-500 flex items-center justify-center">
            <span className="text-white text-2xl font-bold tracking-tight select-none">
              {initials || "ME"}
            </span>
          </div>
        )}

        <div className="text-center">
          <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
            {name}
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            {title}
          </p>
        </div>
      </div>

      <div className="w-full h-px bg-neutral-200 dark:bg-neutral-800 mb-8" />

      {/* Contact 링크 */}
      <nav className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-2">
          Contact
        </p>

        <a
          href={`mailto:${contact.email}`}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-neutral-600 dark:text-neutral-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors"
        >
          <MailIcon />
          <span className="truncate">{contact.email}</span>
        </a>

        {contact.github && (
          <a
            href={contact.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-neutral-600 dark:text-neutral-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors"
          >
            <GitHubIcon />
            <span>GitHub</span>
          </a>
        )}

        {contact.blog && (
          <a
            href={contact.blog}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-neutral-600 dark:text-neutral-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors"
          >
            <ExternalLinkIcon />
            <span>Blog</span>
          </a>
        )}
      </nav>

      <div className="w-full h-px bg-neutral-200 dark:bg-neutral-800 my-8" />

      {/* 내부 네비게이션 */}
      <nav className="flex flex-col gap-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-2">
          Navigate
        </p>
        {[
          { label: "About", href: "#about" },
          { label: "Projects", href: "#projects" },
          { label: "Skills", href: "#skills" },
          { label: "Contact", href: "#contact" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="px-3 py-2 rounded-lg text-sm text-neutral-600 dark:text-neutral-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
