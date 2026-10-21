import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useEditorStore } from '../store/useEditorStore';
import { detectDirection } from '../utils/bidi';

interface EditorProps {
  onScrollSync?: (percentage: number) => void;
  externalInsertTrigger?: { prefix: string; suffix: string; defaultText: string; id: number } | null;
}

export const Editor: React.FC<EditorProps> = ({ onScrollSync, externalInsertTrigger }) => {
  const {
    tabs,
    activeTabId,
    updateActiveTabContent,
    settings,
    saveActiveTab,
    saveActiveTabAs,
    setCursorPosition,
  } = useEditorStore();

  const activeTab = tabs.find((t) => t.id === activeTabId);
  const content = activeTab?.content || '';

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const [lineCount, setLineCount] = useState<number>(1);

  // Compute direction
  const effectiveDirection =
    activeTab?.direction === 'auto' || !activeTab?.direction
      ? detectDirection(content)
      : activeTab.direction;

  // Update line count
  useEffect(() => {
    const lines = content.split('\n').length;
    setLineCount(Math.max(1, lines));
  }, [content]);

  // Handle external snippet insertion from Toolbar
  useEffect(() => {
    if (!externalInsertTrigger || !textareaRef.current) return;
    const { prefix, suffix, defaultText } = externalInsertTrigger;
    insertTextAtCursor(prefix, suffix, defaultText);
  }, [externalInsertTrigger]);

  const insertTextAtCursor = useCallback(
    (prefix: string, suffix: string, defaultText: string) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selected = textarea.value.substring(start, end);
      const replacement = selected.length > 0 ? selected : defaultText;
      const newText =
        textarea.value.substring(0, start) +
        prefix +
        replacement +
        suffix +
        textarea.value.substring(end);

      updateActiveTabContent(newText);

      // Restore and update selection
      setTimeout(() => {
        textarea.focus();
        const cursorStart = start + prefix.length;
        const cursorEnd = cursorStart + replacement.length;
        textarea.setSelectionRange(cursorStart, cursorEnd);
      }, 0);
    },
    [updateActiveTabContent]
  );

  // Scroll synchronization
  const handleScroll = () => {
    if (!textareaRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = textareaRef.current;

    // Sync line numbers scroll
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = scrollTop;
    }

    if (onScrollSync && scrollHeight > clientHeight) {
      const percentage = scrollTop / (scrollHeight - clientHeight);
      onScrollSync(percentage);
    }
  };

  // Track cursor position
  const updateCursorPos = () => {
    if (!textareaRef.current) return;
    const pos = textareaRef.current.selectionStart;
    const textBefore = textareaRef.current.value.substring(0, pos);
    const lines = textBefore.split('\n');
    const currentLine = lines.length;
    const currentCol = lines[lines.length - 1].length + 1;
    setCursorPosition(currentLine, currentCol);
  };

  // Keyboard shortcuts and smart editing
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Ctrl+S: Save
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
      e.preventDefault();
      if (e.shiftKey) {
        saveActiveTabAs();
      } else {
        saveActiveTab();
      }
      return;
    }

    // Ctrl+B: Bold
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
      e.preventDefault();
      insertTextAtCursor('**', '**', 'متن پررنگ');
      return;
    }

    // Ctrl+I: Italic
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'i') {
      e.preventDefault();
      insertTextAtCursor('*', '*', 'متن مایل');
      return;
    }

    // Ctrl+K: Link
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      insertTextAtCursor('[', '](https://)', 'عنوان پیوند');
      return;
    }

    // Tab / Shift+Tab for Indentation
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      if (e.shiftKey) {
        // Unindent
        const beforeCursor = textarea.value.substring(0, start);
        const afterCursor = textarea.value.substring(end);
        if (beforeCursor.endsWith('  ')) {
          const updated = beforeCursor.slice(0, -2) + afterCursor;
          updateActiveTabContent(updated);
          setTimeout(() => textarea.setSelectionRange(start - 2, start - 2), 0);
        }
      } else {
        // Indent 2 spaces
        const updated =
          textarea.value.substring(0, start) + '  ' + textarea.value.substring(end);
        updateActiveTabContent(updated);
        setTimeout(() => textarea.setSelectionRange(start + 2, start + 2), 0);
      }
      return;
    }

    // Auto-pairing quotes and brackets
    const pairs: Record<string, string> = {
      '(': ')',
      '[': ']',
      '{': '}',
      '`': '`',
      '"': '"',
      '«': '»', // Persian quotation marks
    };

    if (pairs[e.key]) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const closeChar = pairs[e.key];

      if (start !== end) {
        // Wrap selected text
        e.preventDefault();
        const selected = textarea.value.substring(start, end);
        const updated =
          textarea.value.substring(0, start) +
          e.key +
          selected +
          closeChar +
          textarea.value.substring(end);
        updateActiveTabContent(updated);
        setTimeout(() => textarea.setSelectionRange(start + 1, end + 1), 0);
        return;
      }
    }

    // Smart Enter for Markdown Lists
    if (e.key === 'Enter') {
      const pos = textarea.selectionStart;
      const textBefore = textarea.value.substring(0, pos);
      const lastLine = textBefore.split('\n').pop() || '';

      // Match checklist
      const checkMatch = lastLine.match(/^(\s*)- \[[ x]\]\s*(.*)$/);
      if (checkMatch) {
        e.preventDefault();
        if (checkMatch[2].trim() === '') {
          // Empty checklist item -> clear prefix
          const updated = textBefore.slice(0, -lastLine.length) + textarea.value.substring(pos);
          updateActiveTabContent(updated);
          setTimeout(() => textarea.setSelectionRange(pos - lastLine.length, pos - lastLine.length), 0);
        } else {
          const indent = checkMatch[1] || '';
          const addition = `\n${indent}- [ ] `;
          const updated = textBefore + addition + textarea.value.substring(pos);
          updateActiveTabContent(updated);
          setTimeout(() => textarea.setSelectionRange(pos + addition.length, pos + addition.length), 0);
        }
        return;
      }

      // Match unordered list (- or *)
      const bulletMatch = lastLine.match(/^(\s*)([-*])\s+(.*)$/);
      if (bulletMatch) {
        e.preventDefault();
        if (bulletMatch[3].trim() === '') {
          // Empty item -> end list
          const updated = textBefore.slice(0, -lastLine.length) + textarea.value.substring(pos);
          updateActiveTabContent(updated);
          setTimeout(() => textarea.setSelectionRange(pos - lastLine.length, pos - lastLine.length), 0);
        } else {
          const addition = `\n${bulletMatch[1]}${bulletMatch[2]} `;
          const updated = textBefore + addition + textarea.value.substring(pos);
          updateActiveTabContent(updated);
          setTimeout(() => textarea.setSelectionRange(pos + addition.length, pos + addition.length), 0);
        }
        return;
      }

      // Match ordered list (1. 2. etc.)
      const numMatch = lastLine.match(/^(\s*)(\d+)\.\s+(.*)$/);
      if (numMatch) {
        e.preventDefault();
        if (numMatch[3].trim() === '') {
          // Empty -> end list
          const updated = textBefore.slice(0, -lastLine.length) + textarea.value.substring(pos);
          updateActiveTabContent(updated);
          setTimeout(() => textarea.setSelectionRange(pos - lastLine.length, pos - lastLine.length), 0);
        } else {
          const nextNum = parseInt(numMatch[2], 10) + 1;
          const addition = `\n${numMatch[1]}${nextNum}. `;
          const updated = textBefore + addition + textarea.value.substring(pos);
          updateActiveTabContent(updated);
          setTimeout(() => textarea.setSelectionRange(pos + addition.length, pos + addition.length), 0);
        }
        return;
      }
    }
  };

  const getFontFamily = () => {
    switch (settings.fontFamily) {
      case 'vazir':
        return 'var(--app-font-vazir)';
      case 'inter':
        return 'var(--app-font-inter)';
      case 'mono':
        return 'var(--app-font-mono)';
      default:
        return 'var(--app-font-vazir)';
    }
  };

  return (
    <div className="relative flex-1 h-full flex bg-white dark:bg-slate-900 overflow-hidden">
      {/* Line Numbers Bar */}
      <div
        ref={lineNumbersRef}
        aria-hidden="true"
        className="w-12 py-4 select-none bg-slate-50 dark:bg-slate-950/60 border-e border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600 text-xs text-center font-mono overflow-hidden"
        style={{
          lineHeight: `${settings.lineHeight * 1.5}rem`,
          fontSize: `${Math.max(11, settings.fontSize - 3)}px`,
        }}
      >
        {Array.from({ length: lineCount }, (_, i) => (
          <div key={i + 1} className="h-[1.5em] leading-[1.5em]">
            {i + 1}
          </div>
        ))}
      </div>

      {/* Main Textarea */}
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => updateActiveTabContent(e.target.value)}
        onScroll={handleScroll}
        onKeyDown={handleKeyDown}
        onKeyUp={updateCursorPos}
        onClick={updateCursorPos}
        dir={effectiveDirection}
        spellCheck={false}
        placeholder="شروع به نوشتن مارک‌داون کنید... / Start writing Markdown here..."
        className="editor-textarea flex-1 h-full p-4 bg-transparent text-slate-900 dark:text-slate-100 overflow-y-auto focus:ring-0 leading-relaxed transition-all"
        style={{
          fontSize: `${settings.fontSize}px`,
          lineHeight: settings.lineHeight,
          fontFamily: getFontFamily(),
        }}
      />
    </div>
  );
};
