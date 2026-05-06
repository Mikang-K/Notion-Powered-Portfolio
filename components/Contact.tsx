"use client";

import { motion } from "framer-motion";

interface ContactItem {
  label: string;
  value: string;
  href: string;
  icon: React.ReactNode;
  description: string;
}

function MailIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  );
}

const contacts: ContactItem[] = [
  {
    label: "Email",
    value: "qorwlsaud1@gmail.com",
    href: "mailto:qorwlsaud1@gmail.com",
    icon: <MailIcon />,
    description: "협업·채용 문의는 이메일로 편하게 연락 주세요.",
  },
  {
    label: "GitHub",
    value: "github.com/Mikang87",
    href: "https://github.com/Mikang-K",
    icon: <GitHubIcon />,
    description: "개인 프로젝트와 오픈소스 기여를 확인할 수 있습니다.",
  },
];

export function Contact() {
  return (
    <section
      id="contact"
      data-section="contact"
      className="py-16 lg:py-24 px-6 lg:px-12"
    >
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
        Contact
      </h2>
      <p className="text-neutral-500 dark:text-neutral-400 mb-12 text-sm sm:text-base">
        아래 채널로 언제든지 연락 주세요.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {contacts.map((item, index) => {
          const isDisabled = !item.href;

          const cardContent = (
            <div className="flex flex-col gap-4 p-6 h-full">
              <div className="flex items-center gap-3">
                <span className="text-violet-500 dark:text-violet-400">
                  {item.icon}
                </span>
                <span className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
                  {item.label}
                </span>
              </div>
              <p className="text-sm text-violet-600 dark:text-violet-400 font-medium truncate">
                {item.value}
              </p>
              <p className="text-sm leading-relaxed text-neutral-500 dark:text-neutral-400 mt-auto">
                {item.description}
              </p>
            </div>
          );

          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.08 }}
              whileHover={isDisabled ? undefined : { y: -4 }}
              className={`rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 overflow-hidden transition-shadow ${
                isDisabled
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:border-violet-300 dark:hover:border-violet-700 hover:shadow-lg hover:shadow-violet-500/10 cursor-pointer"
              }`}
            >
              {isDisabled ? (
                cardContent
              ) : (
                <a
                  href={item.href}
                  target={item.href.startsWith("mailto:") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  className="block h-full"
                >
                  {cardContent}
                </a>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
