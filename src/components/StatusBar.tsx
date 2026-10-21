import React from 'react';
import { useEditorStore } from '../store/useEditorStore';
import { countWords, countCharacters, estimateReadingTime, toPersianDigits } from '../utils/bidi';
import { Check, Clock, FileCode, Edit3 } from 'lucide-react';

export const StatusBar: React.FC = () => {
  const { tabs, activeTabId, cursorPosition, appLanguage, statusMessage } = useEditorStore();
  const activeTab = tabs.find((t) => t.id === activeTabId);
  const content = activeTab?.content || '';
  const isFa = appLanguage === 'fa';

  const words = countWords(content);
  const chars = countCharacters(content);
  const readingTime = estimateReadingTime(content, isFa);

  return (
    <div className="flex items-center justify-between px-3 py-1 bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 select-none z-10">
      {/* Left items / Primary stats */}
      <div className="flex items-center gap-3">
        {statusMessage ? (
          <span className="text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1 animate-fadeIn">
            <Check size={13} />
            {statusMessage}
          </span>
        ) : (
          <>
            <span className="flex items-center gap-1">
              <Edit3 size={12} className="text-slate-400" />
              <span>{isFa ? 'کلمات:' : 'Words:'}</span>
              <strong className="text-slate-700 dark:text-slate-300 font-semibold">
                {isFa ? toPersianDigits(words) : words.toLocaleString()}
              </strong>
            </span>

            <span className="hidden sm:inline">|</span>

            <span className="hidden sm:flex items-center gap-1">
              <span>{isFa ? 'کاراکترها:' : 'Characters:'}</span>
              <strong className="text-slate-700 dark:text-slate-300 font-semibold">
                {isFa ? toPersianDigits(chars.total) : chars.total.toLocaleString()}
              </strong>
            </span>

            <span className="hidden md:inline">|</span>

            <span className="hidden md:flex items-center gap-1">
              <Clock size={12} className="text-slate-400" />
              <span>{readingTime.label}</span>
            </span>
          </>
        )}
      </div>

      {/* Right items / Document details */}
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1">
          <span>{isFa ? 'سطر:' : 'Ln:'}</span>
          <strong className="text-slate-700 dark:text-slate-300">
            {isFa ? toPersianDigits(cursorPosition.line) : cursorPosition.line}
          </strong>
          <span>{isFa ? 'ستون:' : 'Col:'}</span>
          <strong className="text-slate-700 dark:text-slate-300">
            {isFa ? toPersianDigits(cursorPosition.col) : cursorPosition.col}
          </strong>
        </span>

        <span className="hidden sm:inline">|</span>

        <span className="hidden sm:inline font-mono">UTF-8</span>

        <span className="hidden sm:inline">|</span>

        <span className="flex items-center gap-1 font-mono">
          <FileCode size={12} className="text-blue-500" />
          <span>Markdown</span>
        </span>

        <span>|</span>

        <span
          className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
            activeTab?.isDirty
              ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400'
              : 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
          }`}
        >
          {activeTab?.isDirty
            ? isFa
              ? 'ذخیره نشده'
              : 'Unsaved'
            : isFa
            ? 'ذخیره شده'
            : 'Saved'}
        </span>
      </div>
    </div>
  );
};
