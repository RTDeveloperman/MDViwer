import React from 'react';
import { X, Sliders, Type, Clock, RotateCcw } from 'lucide-react';
import { useEditorStore, AppSettings } from '../store/useEditorStore';

export const SettingsModal: React.FC = () => {
  const { isSettingsOpen, toggleSettingsModal, settings, updateSettings, appLanguage } = useEditorStore();
  const isFa = appLanguage === 'fa';

  if (!isSettingsOpen) return null;

  const handleReset = () => {
    updateSettings({
      fontSize: 16,
      fontFamily: 'vazir',
      lineHeight: 1.7,
      autoSave: true,
      autoSaveInterval: 30,
      syncScroll: true,
      previewTheme: 'default',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col text-slate-800 dark:text-slate-100 text-sm">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-2 font-semibold">
            <Sliders size={18} className="text-blue-500" />
            <span>{isFa ? 'تنظیمات و شخصی‌سازی' : 'Preferences & Customization'}</span>
          </div>
          <button
            onClick={toggleSettingsModal}
            className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5 overflow-y-auto max-h-[75vh]">
          {/* Font Family */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
              <Type size={14} />
              <span>{isFa ? 'فونت ویرایشگر و پیش‌نمایش' : 'Editor & Preview Font'}</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'vazir', label: 'وزیرمتن (فارسی)', sample: 'متن نمونه' },
                { id: 'inter', label: 'Inter (انگلیسی)', sample: 'English text' },
                { id: 'mono', label: 'Fira Code (کد)', sample: 'const x = 1;' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => updateSettings({ fontFamily: f.id as any })}
                  className={`p-2.5 rounded-lg border text-start transition-all ${
                    settings.fontFamily === f.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="text-xs">{f.label}</div>
                  <div className="text-[11px] text-slate-400 mt-1 truncate">{f.sample}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Font Size & Line Height */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {isFa ? 'اندازه فونت' : 'Font Size'}
                </label>
                <span className="text-xs font-mono font-bold text-blue-500">{settings.fontSize}px</span>
              </div>
              <input
                type="range"
                min="12"
                max="26"
                step="1"
                value={settings.fontSize}
                onChange={(e) => updateSettings({ fontSize: parseInt(e.target.value, 10) })}
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {isFa ? 'فاصله خطوط (Line Height)' : 'Line Height'}
                </label>
                <span className="text-xs font-mono font-bold text-blue-500">{settings.lineHeight}</span>
              </div>
              <input
                type="range"
                min="1.3"
                max="2.4"
                step="0.1"
                value={settings.lineHeight}
                onChange={(e) => updateSettings({ lineHeight: parseFloat(e.target.value) })}
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>
          </div>

          <hr className="border-slate-200 dark:border-slate-800" />

          {/* Auto-save Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-xs flex items-center gap-1.5">
                  <Clock size={14} className="text-blue-500" />
                  <span>{isFa ? 'ذخیره خودکار (Auto-Save)' : 'Auto-Save'}</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  {isFa
                    ? 'ذخیره دوره‌ای تغییرات فایل‌های باز شده'
                    : 'Automatically persist changes periodically'}
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.autoSave}
                onChange={(e) => updateSettings({ autoSave: e.target.checked })}
                className="w-4 h-4 accent-blue-500 rounded cursor-pointer"
              />
            </div>

            {settings.autoSave && (
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-500">{isFa ? 'فاصله زمانی ذخیره:' : 'Interval:'}</span>
                <select
                  value={settings.autoSaveInterval}
                  onChange={(e) => updateSettings({ autoSaveInterval: parseInt(e.target.value, 10) })}
                  className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2.5 py-1 text-xs outline-none"
                >
                  <option value={15}>{isFa ? 'هر ۱۵ ثانیه' : 'Every 15s'}</option>
                  <option value={30}>{isFa ? 'هر ۳۰ ثانیه' : 'Every 30s'}</option>
                  <option value={60}>{isFa ? 'هر ۱ دقیقه' : 'Every 1m'}</option>
                  <option value={120}>{isFa ? 'هر ۲ دقیقه' : 'Every 2m'}</option>
                </select>
              </div>
            )}
          </div>

          <hr className="border-slate-200 dark:border-slate-800" />

          {/* Sync Scroll */}
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-xs">
                {isFa ? 'همگام‌سازی اسکرول دو پنل' : 'Synchronized Scrolling'}
              </div>
              <div className="text-[11px] text-slate-400">
                {isFa
                  ? 'اسکرول همزمان ویرایشگر و پیش‌نمایش'
                  : 'Sync scroll positions between editor & preview'}
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.syncScroll}
              onChange={(e) => updateSettings({ syncScroll: e.target.checked })}
              className="w-4 h-4 accent-blue-500 rounded cursor-pointer"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
          >
            <RotateCcw size={13} />
            <span>{isFa ? 'بازنشانی به حالت پیش‌فرض' : 'Reset to Defaults'}</span>
          </button>

          <button
            onClick={toggleSettingsModal}
            className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs transition-colors shadow-sm"
          >
            {isFa ? 'بستن' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
