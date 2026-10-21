import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import mermaid from 'mermaid';
import { Check, Copy } from 'lucide-react';
import { useEditorStore } from '../store/useEditorStore';
import { detectDirection } from '../utils/bidi';

// Initialize mermaid
mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
});

export interface PreviewHandle {
  scrollToPercentage: (percentage: number) => void;
}

// Mermaid Renderer Component
const MermaidDiagram: React.FC<{ chart: string }> = ({ chart }) => {
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const chartId = useRef(`mermaid-${Math.random().toString(36).substring(2, 9)}`);

  useEffect(() => {
    let isMounted = true;
    const renderChart = async () => {
      try {
        setError(null);
        // Reset diagram container
        const { svg: renderedSvg } = await mermaid.render(chartId.current, chart);
        if (isMounted) {
          setSvg(renderedSvg);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'خطا در رندر نمودار Mermaid');
        }
      }
    };

    if (chart && chart.trim()) {
      renderChart();
    }
    return () => {
      isMounted = false;
    };
  }, [chart]);

  if (error) {
    return (
      <div className="p-3 my-2 text-xs text-rose-500 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded font-mono">
        {error}
      </div>
    );
  }

  return (
    <div
      className="mermaid-diagram-container"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};

// Code Block with Copy Button
const CodeBlock: React.FC<{
  language?: string;
  value: string;
  isDark: boolean;
}> = ({ language, value, isDark }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (language === 'mermaid') {
    return <MermaidDiagram chart={value} />;
  }

  return (
    <div className="relative group my-4 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-100 dark:bg-slate-800/80 text-xs text-slate-500 dark:text-slate-400 font-mono select-none">
        <span>{language || 'text'}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-2 py-0.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300"
          title="کپی کد / Copy Code"
        >
          {copied ? (
            <>
              <Check size={13} className="text-emerald-500" />
              <span className="text-emerald-500">کپی شد</span>
            </>
          ) : (
            <>
              <Copy size={13} />
              <span>کپی</span>
            </>
          )}
        </button>
      </div>
      <SyntaxHighlighter
        language={language || 'text'}
        style={isDark ? vscDarkPlus : prism}
        customStyle={{
          margin: 0,
          padding: '1rem',
          fontSize: '0.88rem',
          lineHeight: '1.6',
          direction: 'ltr',
          textAlign: 'left',
          background: isDark ? '#0f172a' : '#f8fafc',
        }}
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
};

export const Preview = forwardRef<PreviewHandle>((_props, ref) => {
  const { tabs, activeTabId, theme, settings } = useEditorStore();
  const activeTab = tabs.find((t) => t.id === activeTabId);
  const content = activeTab?.content || '';
  const containerRef = useRef<HTMLDivElement>(null);

  const effectiveDirection =
    activeTab?.direction === 'auto' || !activeTab?.direction
      ? detectDirection(content)
      : activeTab.direction;

  const isDark = theme === 'dark';

  useImperativeHandle(ref, () => ({
    scrollToPercentage: (percentage: number) => {
      if (!containerRef.current) return;
      const { scrollHeight, clientHeight } = containerRef.current;
      containerRef.current.scrollTop = percentage * (scrollHeight - clientHeight);
    },
  }));

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
    <div
      ref={containerRef}
      id="markdown-preview-container"
      dir={effectiveDirection}
      className="flex-1 h-full p-8 overflow-y-auto bg-slate-50/60 dark:bg-slate-950/40 text-slate-800 dark:text-slate-200 transition-colors select-text markdown-body"
      style={{
        fontSize: `${settings.fontSize}px`,
        lineHeight: settings.lineHeight,
        fontFamily: getFontFamily(),
      }}
    >
      <Markdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          code({ inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            const codeString = String(children).replace(/\n$/, '');

            if (!inline && match) {
              return (
                <CodeBlock
                  language={match[1]}
                  value={codeString}
                  isDark={isDark}
                />
              );
            }
            if (!inline && !match) {
              return (
                <CodeBlock
                  language="text"
                  value={codeString}
                  isDark={isDark}
                />
              );
            }
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </Markdown>
    </div>
  );
});

Preview.displayName = 'Preview';
