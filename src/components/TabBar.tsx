import React from 'react';
import { Plus, X, FileText, Circle } from 'lucide-react';
import { useEditorStore } from '../store/useEditorStore';

export const TabBar: React.FC = () => {
  const { tabs, activeTabId, setActiveTab, closeTab, createNewTab, appLanguage } = useEditorStore();
  const isFa = appLanguage === 'fa';

  const handleTabMouseDown = (e: React.MouseEvent, tabId: string) => {
    // Middle mouse click (scroll wheel click) to close tab like Chrome
    if (e.button === 1) {
      e.preventDefault();
      e.stopPropagation();
      closeTab(tabId);
    }
  };

  return (
    <div className="flex items-center bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 px-2 pt-1.5 select-none overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-1">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <div
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              onMouseDown={(e) => handleTabMouseDown(e, tab.id)}
              onAuxClick={(e) => handleTabMouseDown(e, tab.id)}
              title={`${tab.filePath || tab.fileName} ${isFa ? '(برای بستن می‌توانید با کلیک وسط موس کلیک کنید)' : '(Middle-click to close)'}`}
              className={`group flex items-center gap-2 px-3 py-1.5 rounded-t-lg text-xs cursor-pointer border-t-2 transition-all max-w-[200px] min-w-[120px] select-none ${
                isActive
                  ? 'bg-white dark:bg-slate-900 border-blue-500 text-slate-900 dark:text-slate-100 font-medium shadow-sm'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800/50 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <FileText size={14} className={isActive ? 'text-blue-500 flex-shrink-0' : 'text-slate-400 flex-shrink-0'} />
              <span className="truncate flex-1">
                {tab.fileName}
              </span>

              {/* Dirty indicator */}
              {tab.isDirty && (
                <span title={isFa ? 'تغییرات ذخیره نشده' : 'Unsaved changes'} className="flex items-center">
                  <Circle
                    size={7}
                    className="fill-blue-500 text-blue-500 flex-shrink-0 animate-pulse"
                  />
                </span>
              )}

              {/* Close Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(tab.id);
                }}
                className="opacity-0 group-hover:opacity-100 hover:bg-slate-200 dark:hover:bg-slate-700 p-0.5 rounded transition-opacity"
                title={isFa ? 'بستن تب' : 'Close Tab'}
              >
                <X size={12} />
              </button>
            </div>
          );
        })}

        {/* New Tab Button */}
        <button
          onClick={() => createNewTab()}
          title={isFa ? 'تب جدید' : 'New Tab'}
          className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors ml-1"
        >
          <Plus size={15} />
        </button>
      </div>
    </div>
  );
};
