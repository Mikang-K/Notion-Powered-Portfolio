"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { AboutMeContent } from "@/lib/types";
import { saveAboutContent } from "@/app/actions/content";
import { AdminToolbar } from "@/components/admin/AdminToolbar";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.1 },
  }),
};

const INPUT = "w-full text-sm px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-violet-400 focus:border-violet-400 transition-colors";
const TEXTAREA = `${INPUT} resize-none`;
const DEL_BTN = "shrink-0 p-1.5 rounded-md text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors";
const ADD_BTN = "text-xs text-violet-500 hover:text-violet-600 dark:text-violet-400 dark:hover:text-violet-300 font-medium transition-colors flex items-center gap-1 mt-3";

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

interface AboutMeProps {
  content: AboutMeContent;
  isAdmin: boolean;
}

export function AboutMe({ content, isAdmin }: AboutMeProps) {
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
      await saveAboutContent(draft);
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

  const { heading, gradientClass, paragraphs, career, certifications } = local;

  return (
    <section id="about" data-section="about" className="py-16 lg:py-24 px-6 lg:px-12">
      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <motion.span
          className="inline-block text-xs font-semibold uppercase tracking-widest text-violet-500 dark:text-violet-400"
          custom={0} initial="hidden" animate="visible" variants={fadeUp}
        >
          About Me
        </motion.span>
        <div className="flex items-center gap-3">
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

      {isEditing ? (
        /* EDIT MODE */
        <div className="space-y-8">
          {/* Heading */}
          <div>
            <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1.5 uppercase tracking-wider">헤딩</label>
            <input
              type="text"
              className={INPUT}
              value={draft.heading}
              onChange={e => setDraft(prev => ({ ...prev, heading: e.target.value }))}
            />
          </div>

          {/* Paragraphs */}
          <div>
            <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-3 uppercase tracking-wider">소개 문단</label>
            <div className="space-y-3">
              {draft.paragraphs.map((text, i) => (
                <div key={i} className="flex gap-2">
                  <textarea
                    rows={3}
                    className={TEXTAREA}
                    value={text}
                    onChange={e => setDraft(prev => ({
                      ...prev,
                      paragraphs: prev.paragraphs.map((p, idx) => idx === i ? e.target.value : p),
                    }))}
                  />
                  <button
                    onClick={() => setDraft(prev => ({ ...prev, paragraphs: prev.paragraphs.filter((_, idx) => idx !== i) }))}
                    className={DEL_BTN}
                    aria-label="삭제"
                  >
                    <XIcon />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => setDraft(prev => ({ ...prev, paragraphs: [...prev.paragraphs, ""] }))}
              className={ADD_BTN}
            >
              <PlusIcon /> 문단 추가
            </button>
          </div>

          {/* Career */}
          <div>
            <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-3 uppercase tracking-wider">경력</label>
            <div className="space-y-3">
              {draft.career.map((item, i) => (
                <div key={i} className="flex gap-2">
                  <div className="flex-1 grid grid-cols-3 gap-2">
                    <input type="text" placeholder="기간" className={INPUT} value={item.period}
                      onChange={e => setDraft(prev => ({ ...prev, career: prev.career.map((c, idx) => idx === i ? { ...c, period: e.target.value } : c) }))}
                    />
                    <input type="text" placeholder="직책" className={INPUT} value={item.role}
                      onChange={e => setDraft(prev => ({ ...prev, career: prev.career.map((c, idx) => idx === i ? { ...c, role: e.target.value } : c) }))}
                    />
                    <input type="text" placeholder="회사" className={INPUT} value={item.company}
                      onChange={e => setDraft(prev => ({ ...prev, career: prev.career.map((c, idx) => idx === i ? { ...c, company: e.target.value } : c) }))}
                    />
                  </div>
                  <button
                    onClick={() => setDraft(prev => ({ ...prev, career: prev.career.filter((_, idx) => idx !== i) }))}
                    className={DEL_BTN} aria-label="삭제"
                  >
                    <XIcon />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => setDraft(prev => ({ ...prev, career: [...prev.career, { period: "", role: "", company: "" }] }))}
              className={ADD_BTN}
            >
              <PlusIcon /> 경력 추가
            </button>
          </div>

          {/* Certifications */}
          <div>
            <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-3 uppercase tracking-wider">자격증</label>
            <div className="space-y-3">
              {draft.certifications.map((cert, i) => (
                <div key={i} className="flex gap-2">
                  <div className="flex-1 grid grid-cols-3 gap-2">
                    <input type="text" placeholder="자격증명" className={INPUT} value={cert.name}
                      onChange={e => setDraft(prev => ({ ...prev, certifications: prev.certifications.map((c, idx) => idx === i ? { ...c, name: e.target.value } : c) }))}
                    />
                    <input type="text" placeholder="취득일" className={INPUT} value={cert.date}
                      onChange={e => setDraft(prev => ({ ...prev, certifications: prev.certifications.map((c, idx) => idx === i ? { ...c, date: e.target.value } : c) }))}
                    />
                    <input type="text" placeholder="발급기관" className={INPUT} value={cert.issuer}
                      onChange={e => setDraft(prev => ({ ...prev, certifications: prev.certifications.map((c, idx) => idx === i ? { ...c, issuer: e.target.value } : c) }))}
                    />
                  </div>
                  <button
                    onClick={() => setDraft(prev => ({ ...prev, certifications: prev.certifications.filter((_, idx) => idx !== i) }))}
                    className={DEL_BTN} aria-label="삭제"
                  >
                    <XIcon />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => setDraft(prev => ({ ...prev, certifications: [...prev.certifications, { name: "", date: "", issuer: "" }] }))}
              className={ADD_BTN}
            >
              <PlusIcon /> 자격증 추가
            </button>
          </div>
        </div>
      ) : (
        /* VIEW MODE */
        <>
          <motion.h2
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100 mb-10"
            custom={1} initial="hidden" animate="visible" variants={fadeUp}
          >
            <span className={`text-transparent bg-clip-text ${gradientClass}`}>{heading}</span>
          </motion.h2>

          <div className="flex flex-col lg:grid lg:grid-cols-5 lg:gap-12 xl:gap-16">
            <div className="lg:col-span-3 space-y-5">
              {paragraphs.map((text, i) => (
                <motion.p
                  key={i}
                  className="text-base sm:text-lg leading-relaxed text-neutral-600 dark:text-neutral-400"
                  custom={i + 2} initial="hidden" animate="visible" variants={fadeUp}
                >
                  {text}
                </motion.p>
              ))}
            </div>

            <motion.aside
              className="mt-12 lg:mt-0 lg:col-span-2 space-y-8"
              custom={paragraphs.length + 2} initial="hidden" animate="visible" variants={fadeUp}
            >
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-violet-500 dark:text-violet-400 mb-4">경력</h3>
                <ul className="space-y-4">
                  {career.map((item, i) => (
                    <li key={i} className="border-l-2 border-violet-400/40 pl-4">
                      <p className="text-xs text-neutral-400 dark:text-neutral-500 mb-0.5">{item.period}</p>
                      <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">{item.role}</p>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">{item.company}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-violet-500 dark:text-violet-400 mb-4">자격증</h3>
                <ul className="space-y-4">
                  {certifications.map((cert, i) => (
                    <li key={i} className="border-l-2 border-fuchsia-400/40 pl-4">
                      <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">{cert.name}</p>
                      <p className="text-xs text-neutral-400 dark:text-neutral-500">{cert.date} · {cert.issuer}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.aside>
          </div>
        </>
      )}
    </section>
  );
}
