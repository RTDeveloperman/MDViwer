import { create } from 'zustand';
import { sampleMarkdown } from '../utils/markdownSnippets';
import { detectDirection } from '../utils/bidi';
import { FileNode } from '../types/electron';

export interface TabItem {
  id: string;
  filePath?: string;
  fileName: string;
  content: string;
  savedContent: string;
  isDirty: boolean;
  direction: 'rtl' | 'ltr' | 'auto';
}

export interface AppSettings {
  fontSize: number;
  fontFamily: 'vazir' | 'inter' | 'mono' | 'system';
  lineHeight: number;
  autoSave: boolean;
  autoSaveInterval: number; // in seconds
  syncScroll: boolean;
  previewTheme: 'default' | 'github' | 'minimal';
}

interface EditorState {
  tabs: TabItem[];
  activeTabId: string;
  fileTree: FileNode[] | null;
  folderPath: string | null;
  folderName: string | null;
  viewMode: 'split' | 'editor' | 'preview';
  splitRatio: number; // percentage 20 to 80
  theme: 'dark' | 'light';
  appLanguage: 'fa' | 'en';
  cursorPosition: { line: number; col: number };
  isSettingsOpen: boolean;
  isHelpOpen: boolean;
  isFileTreeOpen: boolean;
  statusMessage: string | null;
  settings: AppSettings;

  // Actions
  createNewTab: (initialContent?: string, fileName?: string) => void;
  closeTab: (id: string) => void;
  setActiveTab: (id: string) => void;
  updateActiveTabContent: (content: string) => void;
  saveActiveTab: () => Promise<boolean>;
  saveActiveTabAs: () => Promise<boolean>;
  openFileDialog: () => Promise<void>;
  openFolderDialog: () => Promise<void>;
  loadFileByPath: (filePath: string) => Promise<void>;
  setTabDirection: (id: string, direction: 'rtl' | 'ltr' | 'auto') => void;
  setViewMode: (mode: 'split' | 'editor' | 'preview') => void;
  setSplitRatio: (ratio: number) => void;
  toggleTheme: () => void;
  toggleAppLanguage: () => void;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  toggleSettingsModal: () => void;
  toggleHelpModal: () => void;
  openHelpModal: () => void;
  closeHelpModal: () => void;
  toggleFileTree: () => void;
  setCursorPosition: (line: number, col: number) => void;
  setStatusMessage: (msg: string | null) => void;
}

const DEFAULT_SETTINGS: AppSettings = {
  fontSize: 16,
  fontFamily: 'vazir',
  lineHeight: 1.7,
  autoSave: true,
  autoSaveInterval: 30,
  syncScroll: true,
  previewTheme: 'default',
};

// Load saved settings if any
const savedSettingsStr = localStorage.getItem('persianmd_settings');
const initialSettings: AppSettings = savedSettingsStr
  ? { ...DEFAULT_SETTINGS, ...JSON.parse(savedSettingsStr) }
  : DEFAULT_SETTINGS;

const savedTheme = (localStorage.getItem('persianmd_theme') as 'dark' | 'light') || 'dark';
const savedLang = (localStorage.getItem('persianmd_lang') as 'fa' | 'en') || 'fa';

const initialTabId = 'tab-welcome-1';
const initialTabs: TabItem[] = [
  {
    id: initialTabId,
    fileName: 'راهنما_خوش‌آمدید.md',
    content: sampleMarkdown,
    savedContent: sampleMarkdown,
    isDirty: false,
    direction: 'rtl',
  },
];

export const useEditorStore = create<EditorState>((set, get) => ({
  tabs: initialTabs,
  activeTabId: initialTabId,
  fileTree: null,
  folderPath: null,
  folderName: null,
  viewMode: 'split',
  splitRatio: 50,
  theme: savedTheme,
  appLanguage: savedLang,
  cursorPosition: { line: 1, col: 1 },
  isSettingsOpen: false,
  isHelpOpen: false,
  isFileTreeOpen: false,
  statusMessage: null,
  settings: initialSettings,

  createNewTab: (initialContent = '', fileName = 'سند جدید.md') => {
    const newId = `tab-${Date.now()}`;
    const newTab: TabItem = {
      id: newId,
      fileName,
      content: initialContent,
      savedContent: initialContent,
      isDirty: initialContent.length > 0,
      direction: 'auto',
    };
    set((state) => ({
      tabs: [...state.tabs, newTab],
      activeTabId: newId,
    }));
  },

  closeTab: (id: string) => {
    const { tabs, activeTabId } = get();
    if (tabs.length === 1) {
      // Don't close last tab, replace with empty
      const emptyTabId = `tab-${Date.now()}`;
      set({
        tabs: [
          {
            id: emptyTabId,
            fileName: 'سند جدید.md',
            content: '',
            savedContent: '',
            isDirty: false,
            direction: 'auto',
          },
        ],
        activeTabId: emptyTabId,
      });
      return;
    }

    const tabIndex = tabs.findIndex((t) => t.id === id);
    const newTabs = tabs.filter((t) => t.id !== id);
    let nextActiveId = activeTabId;

    if (activeTabId === id) {
      const nextIndex = Math.max(0, tabIndex - 1);
      nextActiveId = newTabs[nextIndex]?.id || newTabs[0].id;
    }

    set({
      tabs: newTabs,
      activeTabId: nextActiveId,
    });
  },

  setActiveTab: (id: string) => {
    set({ activeTabId: id });
  },

  updateActiveTabContent: (content: string) => {
    const { tabs, activeTabId } = get();
    set({
      tabs: tabs.map((tab) =>
        tab.id === activeTabId
          ? {
              ...tab,
              content,
              isDirty: content !== tab.savedContent,
            }
          : tab
      ),
    });
  },

  saveActiveTab: async () => {
    const { tabs, activeTabId } = get();
    const activeTab = tabs.find((t) => t.id === activeTabId);
    if (!activeTab) return false;

    if (window.electronAPI && activeTab.filePath) {
      const res = await window.electronAPI.writeFile(activeTab.filePath, activeTab.content);
      if (res.success) {
        set({
          tabs: tabs.map((t) =>
            t.id === activeTabId ? { ...t, savedContent: activeTab.content, isDirty: false } : t
          ),
          statusMessage: 'فایل با موفقیت ذخیره شد.',
        });
        setTimeout(() => get().setStatusMessage(null), 3000);
        return true;
      } else {
        alert(`خطا در ذخیره فایل: ${res.error}`);
        return false;
      }
    } else {
      return get().saveActiveTabAs();
    }
  },

  saveActiveTabAs: async () => {
    const { tabs, activeTabId } = get();
    const activeTab = tabs.find((t) => t.id === activeTabId);
    if (!activeTab) return false;

    if (window.electronAPI) {
      const res = await window.electronAPI.saveFileAs(activeTab.fileName, activeTab.content);
      if (res && res.success && res.filePath) {
        set({
          tabs: tabs.map((t) =>
            t.id === activeTabId
              ? {
                  ...t,
                  filePath: res.filePath,
                  fileName: res.fileName || activeTab.fileName,
                  savedContent: activeTab.content,
                  isDirty: false,
                }
              : t
          ),
          statusMessage: 'فایل با موفقیت ذخیره شد.',
        });
        setTimeout(() => get().setStatusMessage(null), 3000);
        return true;
      }
    } else {
      // Browser fallback
      const blob = new Blob([activeTab.content], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = activeTab.fileName.endsWith('.md') ? activeTab.fileName : `${activeTab.fileName}.md`;
      a.click();
      URL.revokeObjectURL(url);
      set({
        tabs: tabs.map((t) => (t.id === activeTabId ? { ...t, savedContent: activeTab.content, isDirty: false } : t)),
      });
      return true;
    }
    return false;
  },

  openFileDialog: async () => {
    if (window.electronAPI) {
      const res = await window.electronAPI.openFile();
      if (res && res.filePath && res.content !== undefined) {
        const { tabs } = get();
        // Check if already open
        const existing = tabs.find((t) => t.filePath === res.filePath);
        if (existing) {
          set({ activeTabId: existing.id });
          return;
        }

        const newId = `tab-${Date.now()}`;
        const autoDir = detectDirection(res.content);
        const newTab: TabItem = {
          id: newId,
          filePath: res.filePath,
          fileName: res.fileName || 'document.md',
          content: res.content,
          savedContent: res.content,
          isDirty: false,
          direction: autoDir,
        };
        set({
          tabs: [...tabs, newTab],
          activeTabId: newId,
        });
      }
    } else {
      // Fallback for browser file input
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.md,.markdown,.txt';
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const content = (event.target?.result as string) || '';
            get().createNewTab(content, file.name);
          };
          reader.readAsText(file);
        }
      };
      input.click();
    }
  },

  openFolderDialog: async () => {
    if (window.electronAPI) {
      const res = await window.electronAPI.openFolder();
      if (res && res.folderPath && res.tree) {
        set({
          folderPath: res.folderPath,
          folderName: res.folderName || 'Project',
          fileTree: res.tree,
          isFileTreeOpen: true,
        });
      }
    }
  },

  loadFileByPath: async (filePath: string) => {
    if (!window.electronAPI) return;
    const { tabs } = get();
    const existing = tabs.find((t) => t.filePath === filePath);
    if (existing) {
      set({ activeTabId: existing.id });
      return;
    }

    const res = await window.electronAPI.readFile(filePath);
    if (res && res.content !== undefined) {
      const newId = `tab-${Date.now()}`;
      const newTab: TabItem = {
        id: newId,
        filePath,
        fileName: res.fileName || filePath.split(/[\\/]/).pop() || 'file.md',
        content: res.content,
        savedContent: res.content,
        isDirty: false,
        direction: detectDirection(res.content),
      };
      set({
        tabs: [...tabs, newTab],
        activeTabId: newId,
      });
    }
  },

  setTabDirection: (id: string, direction: 'rtl' | 'ltr' | 'auto') => {
    set((state) => ({
      tabs: state.tabs.map((t) => (t.id === id ? { ...t, direction } : t)),
    }));
  },

  setViewMode: (viewMode) => set({ viewMode }),
  setSplitRatio: (splitRatio) => set({ splitRatio }),

  toggleTheme: () => {
    const nextTheme = get().theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('persianmd_theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    set({ theme: nextTheme });
  },

  toggleAppLanguage: () => {
    const nextLang = get().appLanguage === 'fa' ? 'en' : 'fa';
    localStorage.setItem('persianmd_lang', nextLang);
    document.documentElement.lang = nextLang;
    document.documentElement.dir = nextLang === 'fa' ? 'rtl' : 'ltr';
    set({ appLanguage: nextLang });
  },

  updateSettings: (newSettings) => {
    const updated = { ...get().settings, ...newSettings };
    localStorage.setItem('persianmd_settings', JSON.stringify(updated));
    set({ settings: updated });
  },

  toggleSettingsModal: () => set((s) => ({ isSettingsOpen: !s.isSettingsOpen })),
  toggleHelpModal: () => set((s) => ({ isHelpOpen: !s.isHelpOpen })),
  openHelpModal: () => set({ isHelpOpen: true }),
  closeHelpModal: () => set({ isHelpOpen: false }),
  toggleFileTree: () => set((s) => ({ isFileTreeOpen: !s.isFileTreeOpen })),
  setCursorPosition: (line, col) => set({ cursorPosition: { line, col } }),
  setStatusMessage: (statusMessage) => set({ statusMessage }),
}));
