"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { ContactContent } from "@/lib/types";
import { saveContact } from "@/app/actions/content";
import { AdminToolbar } from "@/components/admin/AdminToolbar";

const INPUT = "w-full text-sm px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-violet-400 focus:border-violet-400 transition-colors";
const TEXTAREA = `${INPUT} resize-none`;
const DEL_BTN = "shrink-0 p-1.5 rounded-md text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors";

function XIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    </svg>
  );
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

function ContactIcon({ type }: { type: ContactContent["iconType"] }) {
  if (type === "email") return <MailIcon />;
  if (type === "github") return <GitHubIcon />;
  return <ExternalLinkIcon />;
}

interface ContactProps {
  content: ContactContent[];
  isAdmin: boolean;
}

export function Contact({ content, isAdmin }: ContactProps) {
  const [local, setLocal] = useState(content);
  const [draft, setDraft] = useState(content);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function handleEdit() {
    setDraft(JSON.parse(JSON.stringify(local)));
    setIsEditing(true);
    setMessage(null);
  }

  function handleCancel() {
    setIsEditing(false);
  }

  async function handleSave() {
    setIsSaving(true);
    setMessage(null);
    try {
      await saveContact(draft);
      setLocal(draft);
      setIsEditing(false);
      setMessage({ type: "success", text: "저장되었습니다" });
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      const isUnauth = err instanceof Error && err.message === "UNAUTHORIZED";
      setMessage({ type: "error", text: isUnauth ? "권한이 없습니다" : "저장에 실패했습니다" });
    } finally {
      setIsSaving(false);
    }
  }

  function updateItem(i: number, field: keyof ContactContent, value: string) {
    setDraft(prev => prev.map((item, idx) => idx === i ? { ...item, [field]: value } : item));
  }

  return (
    <section id="contact" data-section="contact" className="py-16 lg:py-24 px-6 lg:px-12">
      {/* Header row */}
      <div className="flex items-start justify-between mb-2">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-neutral-100">
          Contact
        </h2>
        <div className="flex items-center gap-3 pt-1">
          {!isEditing && message && (
            <span className={`text-xs font-medium ${message.type === "success" ? "text-emerald-500" : "text-red-500"}`}>
              {message.text}
            </span>
          )}
          {isAdmin && !isEditing && (
            <button
              onClick={handleEdit}
              className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-violet-500 dark:hover:text-violet-400 transition-colors px-2.5 py-1.5 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <PencilIcon /> Edit
            </button>
          )}
          {isEditing && (
            <AdminToolbar onSave={handleSave} onCancel={handleCancel} isSaving={isSaving} message={message} />
          )}
        </div>
      </div>
      <p className="text-neutral-500 dark:text-neutral-400 mb-12 text-sm sm:text-base">
        아래 채널로 언제든지 연락 주세요.
      </p>

      {isEditing ? (
        /* EDIT MODE */
        <div className="space-y-4">
          {draft.map((item, i) => (
            <div
              key={i}
              className="flex gap-3 p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-950"
            >
              <div className="flex-1 space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="레이블 (예: Email)"
                    className={INPUT}
                    value={item.label}
                    onChange={e => updateItem(i, "label", e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="표시 값"
                    className={INPUT}
                    value={item.value}
                    onChange={e => updateItem(i, "value", e.target.value)}
                  />
                  <select
                    className={INPUT}
                    value={item.iconType}
                    onChange={e => updateItem(i, "iconType", e.target.value)}
                  >
                    <option value="email">Email</option>
                    <option value="github">GitHub</option>
                    <option value="external">External Link</option>
                  </select>
                </div>
                <input
                  type="text"
                  placeholder="링크 (mailto:... 또는 https://...)"
                  className={INPUT}
                  value={item.href}
                  onChange={e => updateItem(i, "href", e.target.value)}
                />
                <textarea
                  rows={2}
                  placeholder="설명"
                  className={TEXTAREA}
                  value={item.description}
                  onChange={e => updateItem(i, "description", e.target.value)}
                />
              </div>
              <button
                onClick={() => setDraft(prev => prev.filter((_, idx) => idx !== i))}
                className={`${DEL_BTN} self-start`}
                aria-label="삭제"
              >
                <XIcon />
              </button>
            </div>
          ))}

          <button
            onClick={() => setDraft(prev => [...prev, { label: "", value: "", href: "", description: "", iconType: "external" }])}
            className="text-xs text-violet-500 hover:text-violet-600 dark:text-violet-400 dark:hover:text-violet-300 font-medium transition-colors flex items-center gap-1"
          >
            <PlusIcon /> 항목 추가
          </button>
        </div>
      ) : (
        /* VIEW MODE */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {local.map((item, index) => {
            const isDisabled = !item.href;
            const cardContent = (
              <div className="flex flex-col gap-4 p-6 h-full">
                <div className="flex items-center gap-3">
                  <span className="text-violet-500 dark:text-violet-400">
                    <ContactIcon type={item.iconType} />
                  </span>
                  <span className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
                    {item.label}
                  </span>
                </div>
                <p className="text-sm text-violet-600 dark:text-violet-400 font-medium truncate">{item.value}</p>
                <p className="text-sm leading-relaxed text-neutral-500 dark:text-neutral-400 mt-auto">{item.description}</p>
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
                {isDisabled ? cardContent : (
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
      )}
    </section>
  );
}
