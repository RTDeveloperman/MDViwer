import React, { useState, useMemo } from 'react';
import {
  X,
  BookOpen,
  Search,
  Copy,
  Check,
  PlusCircle,
  ExternalLink,
  Type,
  Heading1,
  ListOrdered,
  Quote,
  Link2,
  Table,
  Code,
  Sigma,
  GitGraph,
  Languages,
  Keyboard,
  Sparkles,
  Lightbulb,
} from 'lucide-react';
import { useEditorStore } from '../store/useEditorStore';
import {
  markdownGuideCategories,
  fullMarkdownTutorialDocument,
  GuideCategory,
  GuideItem,
} from '../utils/markdownGuideData';

interface HelpModalProps {
  onInsertSnippet?: (text: string) => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ onInsertSnippet }) => {
  const { isHelpOpen, closeHelpModal, appLanguage, createNewTab, setStatusMessage } = useEditorStore();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('typography');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'guide' | 'shortcuts'>('guide');

  const isFa = appLanguage === 'fa';

  const categoryIcons: Record<string, React.ReactNode> = {
    Type: <Type size={16} />,
    Heading1: <Heading1 size={16} />,
    ListOrdered: <ListOrdered size={16} />,
    Quote: <Quote size={16} />,
    Link2: <Link2 size={16} />,
    Table: <Table size={16} />,
    Code: <Code size={16} />,
    Sigma: <Sigma size={16} />,
    GitGraph: <GitGraph size={16} />,
    Languages: <Languages size={16} />,
  };

  // Filter items based on search query
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) {
      return markdownGuideCategories;
    }
    const q = searchQuery.toLowerCase().trim();

    return markdownGuideCategories
      .map((cat) => {
        const matchedItems = cat.items.filter(
          (item) =>
            item.title.toLowerCase().includes(q) ||
            item.titleEn.toLowerCase().includes(q) ||
            item.description.toLowerCase().includes(q) ||
            item.markdown.toLowerCase().includes(q)
        );
        return {
          ...cat,
          items: matchedItems,
        };
      })
      .filter((cat) => cat.items.length > 0);
  }, [searchQuery]);

  const activeCategory = useMemo(() => {
    return (
      filteredCategories.find((c) => c.id === selectedCategoryId) ||
      filteredCategories[0] ||
      markdownGuideCategories[0]
    );
  }, [filteredCategories, selectedCategoryId]);

  if (!isHelpOpen) return null;

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleInsert = (text: string) => {
    if (onInsertSnippet) {
      onInsertSnippet(text);
      closeHelpModal();
      setStatusMessage(isFa ? 'کد با موفقیت در ویرایشگر درج شد.' : 'Snippet inserted into editor.');
      setTimeout(() => setStatusMessage(null), 2500);
    }
  };

  const handleOpenTutorialInNewTab = () => {
    createNewTab(fullMarkdownTutorialDocument, 'آموزش_کامل_مارک‌داون.md');
    closeHelpModal();
    setStatusMessage(
      isFa
        ? 'سند جامع آموزش مارک‌داون در تب جدید باز شد. می‌توانید آزادانه آن را ویرایش و تست کنید!'
        : 'Full Markdown Tutorial opened in a new tab!'
    );
    setTimeout(() => setStatusMessage(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-6 animate-fadeIn">
      <div className="w-full max-w-5xl h-[88vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-800 dark:text-slate-100 text-sm">
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-md shadow-blue-500/20">
              <BookOpen size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-base text-slate-900 dark:text-white">
                  {isFa ? 'راهنما و آموزش کامل تگ‌های مارک‌داون' : 'Complete Markdown Tags & Syntax Guide'}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                  {isFa ? 'نسخه جامع' : 'Full Cheat Sheet'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {isFa
                  ? 'آموزش تمام تگ‌ها، نشانه‌گذاری‌ها، فرمول‌های ریاضی، جداول و نمودارهای Mermaid همراه با مثال و درج مستقیم'
                  : 'All Markdown syntax, formatting tags, KaTeX math, tables and Mermaid diagrams with live examples'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Open Full Tutorial as Tab Button */}
            <button
              onClick={handleOpenTutorialInNewTab}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium text-xs shadow-sm shadow-blue-500/20 transition-all hover:scale-[1.02]"
              title={isFa ? 'باز کردن آموزش در یک تب جدید برای تمرین و ویرایش' : 'Open in a new interactive tab'}
            >
              <ExternalLink size={14} />
              <span>{isFa ? 'باز کردن آموزش در تب جدید' : 'Open Tutorial in Tab'}</span>
            </button>

            {/* Close Button */}
            <button
              onClick={closeHelpModal}
              className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition-colors"
              title={isFa ? 'بستن (Esc)' : 'Close (Esc)'}
            >
              <X size={19} />
            </button>
          </div>
        </div>

        {/* Subheader / Search & View Switcher */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 px-5 py-2.5 bg-slate-100/60 dark:bg-slate-950/40 border-b border-slate-200 dark:border-slate-800">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search
              size={15}
              className={`absolute top-1/2 -translate-y-1/2 text-slate-400 ${
                isFa ? 'right-3' : 'left-3'
              }`}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isFa
                  ? 'جستجو در تگ‌ها، مثال‌ها و توضیحات... (مانند: جدول، فرمول، عکس، بولد)'
                  : 'Search tags, examples, syntax... (e.g. table, bold, math)'
              }
              className={`w-full py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500 ${
                isFa ? 'pr-9 pl-3' : 'pl-9 pr-3'
              }`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className={`absolute top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 ${
                  isFa ? 'left-3' : 'right-3'
                }`}
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* View Mode Toggle: Guide vs Shortcuts */}
          <div className="flex items-center gap-1 bg-slate-200/70 dark:bg-slate-800 p-0.5 rounded-lg text-xs self-start sm:self-auto">
            <button
              onClick={() => setActiveView('guide')}
              className={`px-3 py-1 rounded-md transition-all font-medium flex items-center gap-1.5 ${
                activeView === 'guide'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <BookOpen size={13} />
              <span>{isFa ? 'راهنمای تگ‌ها' : 'Syntax Tags'}</span>
            </button>
            <button
              onClick={() => setActiveView('shortcuts')}
              className={`px-3 py-1 rounded-md transition-all font-medium flex items-center gap-1.5 ${
                activeView === 'shortcuts'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Keyboard size={13} />
              <span>{isFa ? 'کلیدهای میانبر' : 'Shortcuts'}</span>
            </button>
          </div>
        </div>

        {/* Modal Main Body */}
        {activeView === 'guide' ? (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar Categories */}
            <div className="w-full md:w-64 border-b md:border-b-0 md:border-l rtl:md:border-l-0 rtl:md:border-r border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 p-2 overflow-y-auto flex-shrink-0 flex md:flex-col gap-1 max-h-36 md:max-h-full">
              <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider hidden md:block">
                {isFa ? 'دسته‌بندی‌های راهنما' : 'Categories'}
              </div>
              {filteredCategories.map((category) => {
                const isActive = activeCategory?.id === category.id;
                return (
                  <button
                    key={category.id}
                    onClick={() => {
                      setSelectedCategoryId(category.id);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all text-start whitespace-nowrap md:whitespace-normal ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={isActive ? 'text-white' : 'text-blue-500'}>
                        {categoryIcons[category.iconName] || <Type size={16} />}
                      </span>
                      <span>{isFa ? category.title : category.titleEn}</span>
                    </div>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        isActive
                          ? 'bg-blue-700 text-white'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                      }`}
                    >
                      {category.items.length}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Content Panel (List of items in selected category) */}
            <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-5 bg-white dark:bg-slate-900">
              {activeCategory ? (
                <>
                  {/* Category Header */}
                  <div className="border-b border-slate-100 dark:border-slate-800/80 pb-3">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="text-blue-500">
                        {categoryIcons[activeCategory.iconName] || <Type size={18} />}
                      </span>
                      <span>{isFa ? activeCategory.title : activeCategory.titleEn}</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {activeCategory.description}
                    </p>
                  </div>

                  {/* Items List */}
                  <div className="grid grid-cols-1 gap-4">
                    {activeCategory.items.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 p-4 transition-all hover:border-slate-300 dark:hover:border-slate-700"
                      >
                        {/* Item Header */}
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div>
                            <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm flex items-center gap-2">
                              <span>{item.title}</span>
                              <span className="text-xs font-normal text-slate-400">
                                ({item.titleEn})
                              </span>
                            </h4>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                              {item.description}
                            </p>
                          </div>

                          {/* Quick Action Buttons */}
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <button
                              onClick={() => handleCopy(item.id, item.markdown)}
                              className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium flex items-center gap-1 transition-colors shadow-sm"
                              title={isFa ? 'کپی کد مارک‌داون' : 'Copy Markdown'}
                            >
                              {copiedId === item.id ? (
                                <>
                                  <Check size={13} className="text-emerald-500" />
                                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                                    {isFa ? 'کپی شد' : 'Copied'}
                                  </span>
                                </>
                              ) : (
                                <>
                                  <Copy size={13} className="text-slate-500" />
                                  <span>{isFa ? 'کپی' : 'Copy'}</span>
                                </>
                              )}
                            </button>

                            {onInsertSnippet && (
                              <button
                                onClick={() => handleInsert(item.markdown)}
                                className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 text-xs font-medium flex items-center gap-1 transition-colors border border-blue-200 dark:border-blue-800"
                                title={isFa ? 'درج مستقیم در متن سند' : 'Insert into Editor'}
                              >
                                <PlusCircle size={13} />
                                <span>{isFa ? 'درج' : 'Insert'}</span>
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Code Syntax Box */}
                        <div className="relative mt-2.5 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 text-slate-100 font-mono text-xs p-3 direction-ltr text-left">
                          <pre className="whitespace-pre-wrap break-words">{item.markdown}</pre>
                        </div>

                        {/* Optional Tip / Shortcut */}
                        {item.tip && (
                          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-2.5 py-1.5 rounded-lg border border-amber-200/60 dark:border-amber-900/40">
                            <Lightbulb size={14} className="flex-shrink-0 text-amber-500" />
                            <span>{item.tip}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-slate-400 text-center">
                  <Search size={32} className="mb-2 opacity-50" />
                  <p className="text-sm">
                    {isFa
                      ? 'موردی با این عبارت یافت نشد.'
                      : 'No tags matching your search query.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Shortcuts Tab View */
          <div className="flex-1 p-6 overflow-y-auto bg-white dark:bg-slate-900">
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Keyboard size={18} className="text-blue-500" />
                  <span>{isFa ? 'جدول کلیدهای میانبر سریع' : 'Keyboard Shortcuts Reference'}</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {isFa
                    ? 'برای سرعت بخشیدن به تایپ و ویرایش، می‌توانید از کلیدهای میانبر زیر استفاده کنید:'
                    : 'Use these keyboard shortcuts to navigate and format rapidly:'}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <table className="w-full text-xs text-start">
                  <thead className="bg-slate-100 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                    <tr>
                      <th className="py-2.5 px-4 text-start">{isFa ? 'کلید میانبر' : 'Shortcut'}</th>
                      <th className="py-2.5 px-4 text-start">{isFa ? 'عملکرد' : 'Action'}</th>
                      <th className="py-2.5 px-4 text-start">{isFa ? 'بخش' : 'Context'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {[
                      { key: 'F1', action: 'باز کردن این پنجره راهنما و آموزش کامل', context: 'عمومی' },
                      { key: 'Ctrl + N', action: 'ایجاد یک تب جدید خالی', context: 'مدیریت فایل' },
                      { key: 'Ctrl + O', action: 'باز کردن فایل مارک‌داون (.md, .txt)', context: 'مدیریت فایل' },
                      { key: 'Ctrl + S', action: 'ذخیره فایل جاری', context: 'مدیریت فایل' },
                      { key: 'Ctrl + B', action: 'پررنگ کردن متن انتخاب شده (Bold)', context: 'ویرایشگر' },
                      { key: 'Ctrl + I', action: 'مایل کردن متن انتخاب شده (Italic)', context: 'ویرایشگر' },
                      { key: 'Ctrl + ,', action: 'باز کردن پنجره تنظیمات و تغییر فونت', context: 'تنظیمات' },
                      { key: 'کلیک وسط موس', action: 'بستن تب (مشابه مرورگر کروم)', context: 'نوار تب‌ها' },
                      { key: 'درگ فایل روی پنجره', action: 'باز کردن سریع هر فایل Markdown', context: 'عمومی' },
                    ].map((row, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        <td className="py-2.5 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                          <kbd className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 shadow-xs">
                            {row.key}
                          </kbd>
                        </td>
                        <td className="py-2.5 px-4 text-slate-800 dark:text-slate-200 font-medium">
                          {row.action}
                        </td>
                        <td className="py-2.5 px-4 text-slate-500 dark:text-slate-400">
                          {row.context}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Sparkles size={14} className="text-amber-500" />
            <span>
              {isFa
                ? 'MDGhashange: ویرایشگر و نمایشگر زیبای مارک‌داون'
                : 'MDGhashange: Beautiful Markdown Editor & Viewer'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenTutorialInNewTab}
              className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-medium"
            >
              <ExternalLink size={13} />
              <span>{isFa ? 'تمرین زنده در یک تب جدید' : 'Live Practice in New Tab'}</span>
            </button>
            <button
              onClick={closeHelpModal}
              className="px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium transition-colors"
            >
              {isFa ? 'بستن' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
