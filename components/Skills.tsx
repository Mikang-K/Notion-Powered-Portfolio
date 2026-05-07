"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { SkillContent, SkillCategory } from "@/lib/types";
import { saveSkills } from "@/app/actions/content";
import { AdminToolbar } from "@/components/admin/AdminToolbar";

const CATEGORIES: SkillCategory[] = ["Frontend", "Backend", "DevOps", "Design", "AI", "Other"];

const categoryColors: Record<string, string> = {
  Frontend: "bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300",
  Backend: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300",
  DevOps: "bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300",
  Design: "bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300",
  AI: "bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300",
  Other: "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300",
};

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

interface SkillsProps {
  content: SkillContent[];
  isAdmin: boolean;
}

export function Skills({ content, isAdmin }: SkillsProps) {
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
      await saveSkills(draft);
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

  function updateSkill(i: number, field: keyof SkillContent, value: string) {
    setDraft(prev => prev.map((s, idx) => idx === i ? { ...s, [field]: value } : s));
  }

  return (
    <section id="skills" data-section="skills" className="py-16 lg:py-24 px-6 lg:px-12 bg-neutral-50 dark:bg-neutral-900/50">
      {/* Header row */}
      <div className="flex items-start justify-between mb-2">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-neutral-100">
          Skills
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
        실제 프로젝트에서 어떻게 활용했는지 기록합니다.
      </p>

      {isEditing ? (
        /* EDIT MODE */
        <div className="space-y-4">
          {draft.map((skill, i) => (
            <div
              key={i}
              className="flex gap-3 p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-950"
            >
              <div className="flex-1 space-y-3">
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="이름"
                    className={INPUT}
                    value={skill.name}
                    onChange={e => updateSkill(i, "name", e.target.value)}
                  />
                  <select
                    className={`${INPUT} w-auto`}
                    value={skill.category}
                    onChange={e => updateSkill(i, "category", e.target.value)}
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <textarea
                  rows={2}
                  placeholder="활용 방법"
                  className={TEXTAREA}
                  value={skill.usage}
                  onChange={e => updateSkill(i, "usage", e.target.value)}
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
            onClick={() => setDraft(prev => [...prev, { name: "", category: "Other", usage: "" }])}
            className="text-xs text-violet-500 hover:text-violet-600 dark:text-violet-400 dark:hover:text-violet-300 font-medium transition-colors flex items-center gap-1"
          >
            <PlusIcon /> 스킬 추가
          </button>
        </div>
      ) : (
        /* VIEW MODE */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {local.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
              className="flex flex-col gap-3 p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 hover:border-violet-300 dark:hover:border-violet-700 transition-colors"
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
                  {skill.name}
                </h3>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${categoryColors[skill.category] ?? categoryColors.Other}`}>
                  {skill.category}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                {skill.usage}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
