import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useEditorStore } from './store/useEditorStore';
import { Toolbar } from './components/Toolbar';
import { Editor } from './components/Editor';
import { Preview, PreviewHandle } from './components/Preview';
import { TabBar } from './components/TabBar';
import { StatusBar } from './components/StatusBar';
import { FileTree } from './components/FileTree';
import { SettingsModal } from './components/SettingsModal';
import { HelpModal } from './components/HelpModal';
import { Minus, Square, X, Sparkles, HelpCircle } from 'lucide-react';
import { detectDirection } from './utils/bidi';

export const App: React.FC = () => {
  const {
    viewMode,
    splitRatio,
    setSplitRatio,
    settings,
    saveActiveTab,
    tabs,
    activeTabId,
    createNewTab,
    openFileDialog,
    toggleSettingsModal,
    toggleHelpModal,
    appLanguage,
    theme,
  } = useEditorStore();

  const previewRef = useRef<PreviewHandle>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [snippetTrigger, setSnippetTrigger] = useState<{
    prefix: string;
    suffix: string;
    defaultText: string;
    id: number;
  } | null>(null);

  const isFa = appLanguage === 'fa';
  const activeTab = tabs.find((t) => t.id === activeTabId);

  // Sync dark class on mount
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Set document direction and lang
  useEffect(() => {
    document.documentElement.lang = appLanguage;
    document.documentElement.dir = isFa ? 'rtl' : 'ltr';
  }, [appLanguage, isFa]);

  // Handle file opened via Windows "Open with" / double click
  useEffect(() => {
    if (!window.electronAPI) return;

    // Check if initial file was passed on startup
    window.electronAPI.getInitialFile().then((res) => {
      if (res && res.filePath && res.content !== undefined) {
        createNewTab(res.content, res.fileName || 'document.md');
      }
    });

    // Listen for files sent from secondary instances (when app is already running and user double clicks another file)
    const unsubscribeCli = window.electronAPI.onOpenFileFromCli((fileData) => {
      if (fileData && fileData.content !== undefined) {
        createNewTab(fileData.content, fileData.fileName || 'document.md');
      }
    });

    // Listen for Help menu triggered from native menu
    const unsubscribeHelp = window.electronAPI.onOpenHelp(() => {
      toggleHelpModal();
    });

    return () => {
      unsubscribeCli();
      unsubscribeHelp();
    };
  }, [createNewTab, toggleHelpModal]);

  // Handle snippet insertion from toolbar
  const handleInsertSnippet = useCallback((prefix: string, suffix: string, defaultText: string) => {
    setSnippetTrigger({ prefix, suffix, defaultText, id: Date.now() });
  }, []);

  // Handle scroll sync from Editor to Preview
  const handleScrollSync = useCallback(
    (percentage: number) => {
      if (settings.syncScroll && previewRef.current) {
        previewRef.current.scrollToPercentage(percentage);
      }
    },
    [settings.syncScroll]
  );

  // Auto-Save interval
  useEffect(() => {
    if (!settings.autoSave) return;
    const intervalMs = (settings.autoSaveInterval || 30) * 1000;
    const timer = setInterval(() => {
      if (activeTab?.isDirty && activeTab?.filePath) {
        saveActiveTab();
      }
    }, intervalMs);

    return () => clearInterval(timer);
  }, [settings.autoSave, settings.autoSaveInterval, activeTab?.isDirty, activeTab?.filePath, saveActiveTab]);

  // Auto-Save on window blur
  useEffect(() => {
    const handleBlur = () => {
      if (settings.autoSave && activeTab?.isDirty && activeTab?.filePath) {
        saveActiveTab();
      }
    };
    window.addEventListener('blur', handleBlur);
    return () => window.removeEventListener('blur', handleBlur);
  }, [settings.autoSave, activeTab?.isDirty, activeTab?.filePath, saveActiveTab]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleGlobalKeys = (e: KeyboardEvent) => {
      if (e.key === 'F1') {
        e.preventDefault();
        toggleHelpModal();
      } else if (e.ctrlKey || e.metaKey) {
        if (e.key.toLowerCase() === 'n') {
          e.preventDefault();
          createNewTab();
        } else if (e.key.toLowerCase() === 'o') {
          e.preventDefault();
          openFileDialog();
        } else if (e.key === ',') {
          e.preventDefault();
          toggleSettingsModal();
        } else if (e.key.toLowerCase() === 'h') {
          e.preventDefault();
          toggleHelpModal();
        }
      }
    };
    window.addEventListener('keydown', handleGlobalKeys);
    return () => window.removeEventListener('keydown', handleGlobalKeys);
  }, [createNewTab, openFileDialog, toggleSettingsModal, toggleHelpModal]);

  // Drag and Drop File onto Window
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = (event.target?.result as string) || '';
        createNewTab(text, file.name);
      };
      reader.readAsText(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Resizable Splitter Logic
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);

    const startX = e.clientX;
    const initialRatio = splitRatio;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const delta = moveEvent.clientX - startX;
      const deltaPercent = (delta / rect.width) * 100 * (isFa ? -1 : 1);
      const newRatio = Math.min(80, Math.max(20, initialRatio + deltaPercent));
      setSplitRatio(newRatio);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Window Controls for Electron
  const handleMinimize = () => window.electronAPI?.minimizeWindow();
  const handleMaximize = () => window.electronAPI?.maximizeWindow();
  const handleClose = () => window.electronAPI?.closeWindow();

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className={`h-screen w-screen flex flex-col bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans select-none overflow-hidden ${
        isDragging ? 'cursor-col-resize select-none' : ''
      }`}
    >
      {/* Title Bar / Header */}
      <div className="flex items-center justify-between px-3 py-1 bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 select-none">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-sm font-bold text-[10px]">
            MD
          </div>
          <span className="font-bold tracking-tight text-slate-800 dark:text-slate-100 text-sm">
            MD<span className="text-blue-500">Ghashange</span>
          </span>
          <span className="text-[10px] text-slate-400 hidden sm:inline">
            | {isFa ? 'نمایشگر و ویرایشگر زیبای مارک‌داون' : 'Beautiful Markdown Editor & Viewer'}
          </span>

          {/* Top Help Menu Button */}
          <button
            onClick={toggleHelpModal}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/50 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-400 font-medium text-xs transition-colors border border-blue-200/60 dark:border-blue-800/60 mr-2 ml-2"
            title={isFa ? 'راهنما و آموزش کامل تگ‌های مارک‌داون (کلید F1)' : 'Markdown Tags & Syntax Guide (F1)'}
          >
            <HelpCircle size={13} />
            <span>{isFa ? 'راهنما (Help)' : 'Help'}</span>
            <kbd className="hidden md:inline px-1 py-0.2 rounded bg-blue-100 dark:bg-blue-900 text-[10px] text-blue-700 dark:text-blue-300 font-mono">
              F1
            </kbd>
          </button>
        </div>

        {/* Window controls if running inside Electron */}
        {window.electronAPI && (
          <div className="flex items-center gap-1 no-print">
            <button
              onClick={handleMinimize}
              className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition-colors text-slate-500"
            >
              <Minus size={14} />
            </button>
            <button
              onClick={handleMaximize}
              className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition-colors text-slate-500"
            >
              <Square size={12} />
            </button>
            <button
              onClick={handleClose}
              className="p-1 hover:bg-rose-500 hover:text-white rounded transition-colors text-slate-500"
            >
              <X size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <TabBar />

      {/* Action Toolbar */}
      <Toolbar onInsertSnippet={handleInsertSnippet} />

      {/* Main Workspace Area with optional File Tree Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Collapsible File Explorer */}
        <FileTree />

        {/* Editor & Preview Split Container */}
        <div ref={containerRef} className="flex-1 flex h-full overflow-hidden relative">
          {/* Editor Panel */}
          {(viewMode === 'split' || viewMode === 'editor') && (
            <div
              style={{
                width: viewMode === 'split' ? `${splitRatio}%` : '100%',
              }}
              className="h-full flex flex-col overflow-hidden"
            >
              <Editor
                onScrollSync={handleScrollSync}
                externalInsertTrigger={snippetTrigger}
              />
            </div>
          )}

          {/* Resizable Splitter Handle */}
          {viewMode === 'split' && (
            <div
              onMouseDown={handleMouseDown}
              className="w-1.5 h-full bg-slate-200 dark:bg-slate-800 hover:bg-blue-500 dark:hover:bg-blue-500 transition-colors cursor-col-resize flex items-center justify-center group flex-shrink-0 z-20"
              title={isFa ? 'تغییر اندازه پنل‌ها با درگ' : 'Drag to resize panels'}
            >
              <div className="w-0.5 h-8 bg-slate-400 group-hover:bg-white rounded-full transition-colors" />
            </div>
          )}

          {/* Live Preview Panel (Always Beautiful) */}
          {(viewMode === 'split' || viewMode === 'preview') && (
            <div
              style={{
                width: viewMode === 'split' ? `${100 - splitRatio}%` : '100%',
              }}
              className="h-full flex flex-col overflow-hidden"
            >
              <Preview ref={previewRef} />
            </div>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <StatusBar />

      {/* Settings Modal */}
      <SettingsModal />

      {/* Complete Markdown Help & Tutorial Modal */}
      <HelpModal onInsertSnippet={(text) => handleInsertSnippet('', '', text)} />
    </div>
  );
};
