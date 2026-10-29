import React, { useState } from 'react';
import {
  FilePlus,
  FolderOpen,
  Save,
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Code,
  FileCode,
  Link2,
  Image,
  Table,
  CheckSquare,
  Sigma,
  GitGraph,
  Columns,
  Square,
  Eye,
  AlignRight,
  AlignLeft,
  Sparkles,
  Download,
  FileText,
  Copy,
  Sun,
  Moon,
  Settings,
  Languages,
  FolderTree,
  FileSpreadsheet,
  Check,
  HelpCircle,
} from 'lucide-react';
import { useEditorStore } from '../store/useEditorStore';
import { markdownSnippets } from '../utils/markdownSnippets';
import {
  buildStandaloneHtml,
  cleanHtmlForExport,
  copyHtmlToClipboard,
  copyRichFormattedText,
} from '../utils/exportHelpers';

interface ToolbarProps {
  onInsertSnippet: (prefix: string, suffix: string, defaultText: string) => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({ onInsertSnippet }) => {
  const {
    tabs,
    activeTabId,
    viewMode,
    setViewMode,
    theme,
    toggleTheme,
    appLanguage,
    toggleAppLanguage,
    createNewTab,
    openFileDialog,
    openFolderDialog,
    saveActiveTab,
    toggleFileTree,
    toggleSettingsModal,
    toggleHelpModal,
    setTabDirection,
    setStatusMessage,
  } = useEditorStore();

  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  const activeTab = tabs.find((t) => t.id === activeTabId);
  const isFa = appLanguage === 'fa';

  const triggerCopyFeedback = (msg: string) => {
    setCopySuccess(msg);
    setStatusMessage(msg);
    setTimeout(() => {
      setCopySuccess(null);
      setStatusMessage(null);
    }, 2500);
  };

  // 1. Export PDF (Only beautifully rendered preview)
  const handleExportPdf = async () => {
    if (window.electronAPI) {
      const res = await window.electronAPI.exportPdf(activeTab?.fileName);
      if (res.success) {
        setStatusMessage(isFa ? 'فایل PDF از متن زیبا ذخیره شد.' : 'PDF exported successfully.');
        setTimeout(() => setStatusMessage(null), 3000);
      }
    } else {
      window.print();
    }
  };

  // 2. Export HTML (Only beautifully rendered preview)
  const handleExportHtml = async () => {
    const previewEl = document.getElementById('markdown-preview-container');
    if (!previewEl) return;

    const htmlContent = buildStandaloneHtml(
      previewEl.innerHTML,
      activeTab?.fileName || 'MDGhashange Document',
      activeTab?.direction === 'auto' ? 'rtl' : activeTab?.direction || 'rtl',
      theme
    );

    if (window.electronAPI) {
      const res = await window.electronAPI.exportHtml(activeTab?.fileName || 'document.html', htmlContent);
      if (res.success) {
        setStatusMessage(isFa ? 'فایل HTML مستقل با زیبایی ذخیره شد.' : 'HTML exported successfully.');
        setTimeout(() => setStatusMessage(null), 3000);
      }
    } else {
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = (activeTab?.fileName.replace(/\.[^/.]+$/, '') || 'document') + '.html';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  // 3. Export DOCX (Word Document from beautifully rendered preview)
  const handleExportDocx = async () => {
    const previewEl = document.getElementById('markdown-preview-container');
    if (!previewEl) return;

    const cleanHtml = cleanHtmlForExport(previewEl.innerHTML);
    const docTitle = activeTab?.fileName.replace(/\.[^/.]+$/, '') || 'MDGhashange Document';

    if (window.electronAPI) {
      setStatusMessage(isFa ? 'در حال ساخت فایل Word (DOCX)...' : 'Generating Word document...');
      const res = await window.electronAPI.exportDocx(docTitle, cleanHtml, docTitle);
      if (res.success) {
        setStatusMessage(isFa ? 'فایل Word (DOCX) با موفقیت ذخیره شد.' : 'Word document exported successfully.');
        setTimeout(() => setStatusMessage(null), 3000);
      } else if (!res.canceled) {
        alert(isFa ? `خطا در ساخت DOCX: ${res.error}` : `Error exporting DOCX: ${res.error}`);
      }
    } else {
      alert(isFa ? 'خروجی DOCX در نسخه دسکتاپ برنامه در دسترس است.' : 'DOCX export is available in the desktop app.');
    }
  };

  // Copy Formatted Rich Text (Pasteable into Word, Telegram, Email, etc.)
  const handleCopyFormattedText = async () => {
    const previewEl = document.getElementById('markdown-preview-container');
    if (!previewEl) return;
    const ok = await copyRichFormattedText(previewEl.innerHTML);
    if (ok) {
      triggerCopyFeedback(isFa ? 'متن زیبا و فرمت‌شده کپی شد' : 'Formatted text copied');
    }
  };

  // Copy Rendered HTML
  const handleCopyHtml = async () => {
    const previewEl = document.getElementById('markdown-preview-container');
    if (!previewEl) return;
    const ok = await copyHtmlToClipboard(previewEl.innerHTML);
    if (ok) {
      triggerCopyFeedback(isFa ? 'کد HTML کپی شد' : 'HTML code copied');
    }
  };

  // Copy Raw Markdown
  const handleCopyMarkdown = async () => {
    if (!activeTab) return;
    await navigator.clipboard.writeText(activeTab.content);
    triggerCopyFeedback(isFa ? 'متن مارک‌داون کپی شد' : 'Markdown copied');
  };

  return (
    <div className="flex items-center justify-between px-3 py-1.5 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-sm select-none gap-2 flex-wrap">
      {/* File & Tree Actions */}
      <div className="flex items-center gap-1">
        <button
          onClick={toggleFileTree}
          title={isFa ? 'تغییر وضعیت درختواره فایل‌ها' : 'Toggle File Tree'}
          className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
        >
          <FolderTree size={17} />
        </button>

        <div className="h-4 w-[1px] bg-slate-300 dark:bg-slate-700 mx-0.5" />

        <button
          onClick={() => createNewTab()}
          title={isFa ? 'فایل جدید (Ctrl+N)' : 'New File (Ctrl+N)'}
          className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <FilePlus size={17} />
        </button>

        <button
          onClick={openFileDialog}
          title={isFa ? 'باز کردن فایل (Ctrl+O)' : 'Open File (Ctrl+O)'}
          className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <FolderOpen size={17} />
        </button>

        <button
          onClick={saveActiveTab}
          title={isFa ? 'ذخیره (Ctrl+S)' : 'Save (Ctrl+S)'}
          className={`p-1.5 rounded-md transition-colors ${
            activeTab?.isDirty
              ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/50'
              : 'hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Save size={17} />
        </button>
      </div>

      <div className="h-4 w-[1px] bg-slate-300 dark:bg-slate-700" />

      {/* Markdown Formatting Controls */}
      <div className="flex items-center gap-0.5 flex-wrap">
        <button
          onClick={() => onInsertSnippet(markdownSnippets.bold.prefix, markdownSnippets.bold.suffix, markdownSnippets.bold.defaultText)}
          title={isFa ? 'متن پررنگ (Ctrl+B)' : 'Bold (Ctrl+B)'}
          className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-bold"
        >
          <Bold size={16} />
        </button>

        <button
          onClick={() => onInsertSnippet(markdownSnippets.italic.prefix, markdownSnippets.italic.suffix, markdownSnippets.italic.defaultText)}
          title={isFa ? 'متن مایل (Ctrl+I)' : 'Italic (Ctrl+I)'}
          className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors italic"
        >
          <Italic size={16} />
        </button>

        <button
          onClick={() => onInsertSnippet(markdownSnippets.strikethrough.prefix, markdownSnippets.strikethrough.suffix, markdownSnippets.strikethrough.defaultText)}
          title={isFa ? 'متن خط‌خورده' : 'Strikethrough'}
          className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Strikethrough size={16} />
        </button>

        <div className="h-4 w-[1px] bg-slate-300 dark:bg-slate-700 mx-0.5" />

        <button
          onClick={() => onInsertSnippet(markdownSnippets.h1.prefix, markdownSnippets.h1.suffix, markdownSnippets.h1.defaultText)}
          title={isFa ? 'سرتیتر ۱' : 'Heading 1'}
          className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Heading1 size={16} />
        </button>

        <button
          onClick={() => onInsertSnippet(markdownSnippets.h2.prefix, markdownSnippets.h2.suffix, markdownSnippets.h2.defaultText)}
          title={isFa ? 'سرتیتر ۲' : 'Heading 2'}
          className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Heading2 size={16} />
        </button>

        <button
          onClick={() => onInsertSnippet(markdownSnippets.h3.prefix, markdownSnippets.h3.suffix, markdownSnippets.h3.defaultText)}
          title={isFa ? 'سرتیتر ۳' : 'Heading 3'}
          className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Heading3 size={16} />
        </button>

        <button
          onClick={() => onInsertSnippet(markdownSnippets.quote.prefix, markdownSnippets.quote.suffix, markdownSnippets.quote.defaultText)}
          title={isFa ? 'نقل‌قول' : 'Quote'}
          className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Quote size={16} />
        </button>

        <div className="h-4 w-[1px] bg-slate-300 dark:bg-slate-700 mx-0.5" />

        <button
          onClick={() => onInsertSnippet(markdownSnippets.codeInline.prefix, markdownSnippets.codeInline.suffix, markdownSnippets.codeInline.defaultText)}
          title={isFa ? 'کد درون‌خطی' : 'Inline Code'}
          className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-mono"
        >
          <Code size={16} />
        </button>

        <button
          onClick={() => onInsertSnippet(markdownSnippets.codeBlock.prefix, markdownSnippets.codeBlock.suffix, markdownSnippets.codeBlock.defaultText)}
          title={isFa ? 'بلوک کد' : 'Code Block'}
          className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <FileCode size={16} />
        </button>

        <button
          onClick={() => onInsertSnippet(markdownSnippets.link.prefix, markdownSnippets.link.suffix, markdownSnippets.link.defaultText)}
          title={isFa ? 'درج لینک (Ctrl+K)' : 'Insert Link (Ctrl+K)'}
          className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Link2 size={16} />
        </button>

        <button
          onClick={() => onInsertSnippet(markdownSnippets.image.prefix, markdownSnippets.image.suffix, markdownSnippets.image.defaultText)}
          title={isFa ? 'درج تصویر' : 'Insert Image'}
          className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Image size={16} />
        </button>

        <button
          onClick={() => onInsertSnippet(markdownSnippets.table.prefix, markdownSnippets.table.suffix, markdownSnippets.table.defaultText)}
          title={isFa ? 'درج جدول' : 'Insert Table'}
          className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Table size={16} />
        </button>

        <button
          onClick={() => onInsertSnippet(markdownSnippets.checklist.prefix, markdownSnippets.checklist.suffix, markdownSnippets.checklist.defaultText)}
          title={isFa ? 'لیست وظایف (Checklist)' : 'Task Checklist'}
          className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <CheckSquare size={16} />
        </button>

        <button
          onClick={() => onInsertSnippet(markdownSnippets.mathBlock.prefix, markdownSnippets.mathBlock.suffix, markdownSnippets.mathBlock.defaultText)}
          title={isFa ? 'فرمول ریاضی KaTeX' : 'Math Formula'}
          className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Sigma size={16} />
        </button>

        <button
          onClick={() => onInsertSnippet(markdownSnippets.mermaid.prefix, markdownSnippets.mermaid.suffix, markdownSnippets.mermaid.defaultText)}
          title={isFa ? 'نمودار و دیاگرام Mermaid' : 'Mermaid Diagram'}
          className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <GitGraph size={16} />
        </button>
      </div>

      <div className="h-4 w-[1px] bg-slate-300 dark:bg-slate-700" />

      {/* Direction & View Controls */}
      <div className="flex items-center gap-1">
        {/* Direction Switcher */}
        {activeTab && (
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-md p-0.5 text-xs">
            <button
              onClick={() => setTabDirection(activeTab.id, 'auto')}
              title={isFa ? 'جهت خودکار' : 'Auto Direction'}
              className={`px-2 py-1 rounded transition-colors ${
                activeTab.direction === 'auto'
                  ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400 font-medium'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Sparkles size={13} className="inline mr-1" />
              {isFa ? 'خودکار' : 'Auto'}
            </button>
            <button
              onClick={() => setTabDirection(activeTab.id, 'rtl')}
              title={isFa ? 'راست‌چین اجباری' : 'Force RTL'}
              className={`p-1 rounded transition-colors ${
                activeTab.direction === 'rtl'
                  ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <AlignRight size={14} />
            </button>
            <button
              onClick={() => setTabDirection(activeTab.id, 'ltr')}
              title={isFa ? 'چپ‌چین اجباری' : 'Force LTR'}
              className={`p-1 rounded transition-colors ${
                activeTab.direction === 'ltr'
                  ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <AlignLeft size={14} />
            </button>
          </div>
        )}

        {/* View Mode Switcher */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-md p-0.5">
          <button
            onClick={() => setViewMode('editor')}
            title={isFa ? 'فقط ویرایشگر' : 'Editor Only'}
            className={`p-1 rounded transition-colors ${
              viewMode === 'editor'
                ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Square size={15} />
          </button>
          <button
            onClick={() => setViewMode('split')}
            title={isFa ? 'نمایش دو پنله (تقسیم)' : 'Split View'}
            className={`p-1 rounded transition-colors ${
              viewMode === 'split'
                ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Columns size={15} />
          </button>
          <button
            onClick={() => setViewMode('preview')}
            title={isFa ? 'فقط پیش‌نمایش' : 'Preview Only'}
            className={`p-1 rounded transition-colors ${
              viewMode === 'preview'
                ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Eye size={15} />
          </button>
        </div>
      </div>

      <div className="h-4 w-[1px] bg-slate-300 dark:bg-slate-700" />

      {/* Copy Actions (Copy Formatted, Copy HTML, Copy Raw) */}
      <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-0.5 rounded-lg">
        <button
          onClick={handleCopyFormattedText}
          title={isFa ? 'کپی متن فرمت‌شده و زیبا (مناسب Word، ایمیل و تلگرام)' : 'Copy Beautiful Formatted Text'}
          className="px-2 py-1 rounded-md hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1 text-xs font-medium"
        >
          {copySuccess ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} className="text-blue-500" />}
          <span>{isFa ? 'کپی متن زیبا' : 'Copy Formatted'}</span>
        </button>

        <button
          onClick={handleCopyHtml}
          title={isFa ? 'کپی کد HTML رندر شده' : 'Copy Rendered HTML'}
          className="p-1 rounded-md hover:bg-white dark:hover:bg-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors text-[11px]"
        >
          HTML
        </button>

        <button
          onClick={handleCopyMarkdown}
          title={isFa ? 'کپی سورس مارک‌داون' : 'Copy Raw Markdown'}
          className="p-1 rounded-md hover:bg-white dark:hover:bg-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors text-[11px]"
        >
          MD
        </button>
      </div>

      <div className="h-4 w-[1px] bg-slate-300 dark:bg-slate-700" />

      {/* Export Trio: PDF, HTML, DOCX (Only beautiful rendered text) */}
      <div className="flex items-center gap-1">
        {/* PDF */}
        <button
          onClick={handleExportPdf}
          title={isFa ? 'خروجی PDF از متن زیبای پیش‌نمایش' : 'Export Beautiful PDF'}
          className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1 text-xs font-medium"
        >
          <Download size={15} className="text-rose-500" />
          <span>PDF</span>
        </button>

        {/* HTML */}
        <button
          onClick={handleExportHtml}
          title={isFa ? 'خروجی فایل HTML مستقل از متن زیبا' : 'Export Beautiful HTML'}
          className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1 text-xs font-medium"
        >
          <FileText size={15} className="text-amber-500" />
          <span>HTML</span>
        </button>

        {/* DOCX Word */}
        <button
          onClick={handleExportDocx}
          title={isFa ? 'خروجی به Microsoft Word (DOCX) از متن زیبا' : 'Export to Word (.docx)'}
          className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1 text-xs font-medium"
        >
          <FileSpreadsheet size={15} className="text-blue-500" />
          <span>DOCX</span>
        </button>

        <div className="h-4 w-[1px] bg-slate-300 dark:bg-slate-700 mx-0.5" />

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? (isFa ? 'حالت روشن' : 'Light Mode') : (isFa ? 'حالت تاریک' : 'Dark Mode')}
          className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* UI Language Toggle */}
        <button
          onClick={toggleAppLanguage}
          title={isFa ? 'تغییر زبان به انگلیسی' : 'Switch Language to Persian'}
          className="px-2 py-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors font-medium text-xs flex items-center gap-1"
        >
          <Languages size={15} />
          <span>{isFa ? 'EN' : 'فا'}</span>
        </button>

        {/* Settings Modal Toggle */}
        <button
          onClick={toggleSettingsModal}
          title={isFa ? 'تنظیمات برنامه (Ctrl+,)' : 'Preferences (Ctrl+,)'}
          className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
        >
          <Settings size={16} />
        </button>

        {/* Help & Markdown Guide Toggle */}
        <button
          onClick={toggleHelpModal}
          title={isFa ? 'راهنما و آموزش کامل تگ‌های مارک‌داون (F1)' : 'Markdown Guide & Tutorial (F1)'}
          className="p-1.5 rounded-md hover:bg-blue-50 dark:hover:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors"
        >
          <HelpCircle size={16} />
        </button>
      </div>
    </div>
  );
};
