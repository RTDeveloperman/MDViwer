import React, { useState } from 'react';
import {
  Folder,
  FolderOpen,
  FileText,
  ChevronRight,
  ChevronDown,
  RefreshCw,
  FolderPlus,
  X,
} from 'lucide-react';
import { useEditorStore } from '../store/useEditorStore';
import { FileNode } from '../types/electron';

interface TreeNodeProps {
  node: FileNode;
  level: number;
}

const TreeNode: React.FC<TreeNodeProps> = ({ node, level }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { loadFileByPath, activeTabId, tabs } = useEditorStore();

  const isMd = node.name.endsWith('.md') || node.name.endsWith('.markdown');
  const activeTab = tabs.find((t) => t.id === activeTabId);
  const isSelected = activeTab?.filePath === node.path;

  if (node.isDirectory) {
    return (
      <div>
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 px-2 py-1 rounded cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs transition-colors"
          style={{ paddingInlineStart: `${level * 12 + 8}px` }}
        >
          {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          {isOpen ? (
            <FolderOpen size={14} className="text-amber-500 flex-shrink-0" />
          ) : (
            <Folder size={14} className="text-amber-500 flex-shrink-0" />
          )}
          <span className="truncate">{node.name}</span>
        </div>

        {isOpen && node.children && (
          <div>
            {node.children.map((child) => (
              <TreeNode key={child.path} node={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      onClick={() => loadFileByPath(node.path)}
      className={`flex items-center gap-1.5 px-2 py-1 rounded cursor-pointer text-xs transition-colors ${
        isSelected
          ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-medium'
          : 'hover:bg-slate-200/70 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
      }`}
      style={{ paddingInlineStart: `${level * 12 + 22}px` }}
      title={node.path}
    >
      <FileText size={13} className={isMd ? 'text-blue-500 flex-shrink-0' : 'text-slate-400 flex-shrink-0'} />
      <span className="truncate">{node.name}</span>
    </div>
  );
};

export const FileTree: React.FC = () => {
  const {
    fileTree,
    folderName,
    folderPath,
    isFileTreeOpen,
    toggleFileTree,
    openFolderDialog,
    appLanguage,
  } = useEditorStore();

  const isFa = appLanguage === 'fa';

  if (!isFileTreeOpen) return null;

  return (
    <aside className="w-64 h-full bg-slate-50 dark:bg-slate-950 border-e border-slate-200 dark:border-slate-800 flex flex-col select-none flex-shrink-0 text-sm">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300">
        <span className="truncate">{folderName || (isFa ? 'کاوشگر پوشه' : 'Explorer')}</span>
        <div className="flex items-center gap-1">
          <button
            onClick={openFolderDialog}
            title={isFa ? 'باز کردن پوشه' : 'Open Folder'}
            className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800"
          >
            <FolderPlus size={14} />
          </button>
          <button
            onClick={toggleFileTree}
            title={isFa ? 'بستن پنل' : 'Close Panel'}
            className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Directory Content */}
      <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {fileTree && fileTree.length > 0 ? (
          fileTree.map((node) => <TreeNode key={node.path} node={node} level={0} />)
        ) : (
          <div className="flex flex-col items-center justify-center h-48 text-center p-4 text-xs text-slate-400">
            <p className="mb-3">
              {isFa
                ? 'هیچ پوشه‌ای باز نشده است.'
                : 'No folder is currently open.'}
            </p>
            <button
              onClick={openFolderDialog}
              className="px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors shadow-sm"
            >
              {isFa ? 'انتخاب پوشه پروژه' : 'Open Workspace'}
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
