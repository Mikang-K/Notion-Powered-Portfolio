"use client";

interface AdminToolbarProps {
  onSave: () => void;
  onCancel: () => void;
  isSaving: boolean;
  message?: { type: "success" | "error"; text: string } | null;
}

export function AdminToolbar({ onSave, onCancel, isSaving, message }: AdminToolbarProps) {
  return (
    <div className="flex items-center gap-3">
      {message && (
        <span className={`text-xs font-medium ${message.type === "success" ? "text-emerald-500" : "text-red-500"}`}>
          {message.text}
        </span>
      )}
      <button
        onClick={onCancel}
        disabled={isSaving}
        className="text-sm px-3 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-50 transition-colors"
      >
        취소
      </button>
      <button
        onClick={onSave}
        disabled={isSaving}
        className="text-sm px-4 py-1.5 rounded-md bg-violet-500 hover:bg-violet-600 disabled:opacity-60 text-white transition-colors flex items-center gap-1.5 min-w-[64px] justify-center"
      >
        {isSaving ? (
          <svg className="animate-spin w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : "저장"}
      </button>
    </div>
  );
}
