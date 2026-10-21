/**
 * Export helpers for PDF, HTML and DOCX generation
 */

export function cleanHtmlForExport(containerHtml: string): string {
  // Remove copy buttons or UI interaction elements from the rendered HTML
  const parser = new DOMParser();
  const doc = parser.parseFromString(containerHtml, 'text/html');

  // Remove copy buttons and their parent helper bars
  doc.querySelectorAll('button').forEach((b) => b.remove());

  return doc.body.innerHTML;
}

export function buildStandaloneHtml(
  contentHtml: string,
  title: string,
  direction: 'rtl' | 'ltr',
  theme: 'dark' | 'light'
): string {
  const isDark = theme === 'dark';
  const bgColor = isDark ? '#0f172a' : '#ffffff';
  const textColor = isDark ? '#f8fafc' : '#0f172a';
  const borderColor = isDark ? '#334155' : '#e2e8f0';
  const codeBg = isDark ? '#1e293b' : '#f1f5f9';
  const cleanedHtml = cleanHtmlForExport(contentHtml);

  return `<!DOCTYPE html>
<html lang="${direction === 'rtl' ? 'fa' : 'en'}" dir="${direction}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title || 'MDGhashange Document'}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500&family=Inter:wght@400;500;600&family=Vazirmatn:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css" />
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: 'Vazirmatn', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: ${bgColor};
      color: ${textColor};
      padding: 48px;
      line-height: 1.8;
      max-width: 900px;
      margin: 0 auto;
      font-size: 16px;
    }
    h1, h2, h3, h4, h5, h6 {
      font-weight: 700;
      color: ${textColor};
      margin-top: 1.6em;
      margin-bottom: 0.6em;
      line-height: 1.35;
    }
    h1 { font-size: 2.2rem; border-bottom: 2px solid ${borderColor}; padding-bottom: 0.35em; }
    h2 { font-size: 1.7rem; border-bottom: 1px solid ${borderColor}; padding-bottom: 0.25em; }
    h3 { font-size: 1.35rem; }
    p { margin-bottom: 1.1em; }
    a { color: #3b82f6; text-decoration: underline; }
    code {
      font-family: 'Fira Code', Consolas, monospace;
      background: ${codeBg};
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 0.9em;
      direction: ltr;
      display: inline-block;
    }
    pre {
      background: ${codeBg};
      border: 1px solid ${borderColor};
      border-radius: 8px;
      padding: 16px;
      overflow-x: auto;
      direction: ltr;
      text-align: left;
    }
    pre code {
      background: none;
      padding: 0;
      font-size: 0.9em;
    }
    blockquote {
      border-${direction === 'rtl' ? 'right' : 'left'}: 4px solid #3b82f6;
      padding: 10px 18px;
      margin: 1.2em 0;
      background: ${isDark ? '#1e293b66' : '#f8fafc'};
      border-radius: 4px;
      font-style: italic;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 1.5em 0;
    }
    th, td {
      border: 1px solid ${borderColor};
      padding: 10px 14px;
      text-align: ${direction === 'rtl' ? 'right' : 'left'};
    }
    th {
      background: ${isDark ? '#1e293b' : '#f1f5f9'};
      font-weight: 600;
    }
    ul, ol {
      padding-${direction === 'rtl' ? 'right' : 'left'}: 24px;
      margin-bottom: 1em;
    }
    li { margin-bottom: 0.4em; }
    hr {
      border: 0;
      height: 1px;
      background: ${borderColor};
      margin: 2em 0;
    }
    img {
      max-width: 100%;
      height: auto;
      border-radius: 8px;
      margin: 1em 0;
    }
    @media print {
      body { padding: 0; background: #fff !important; color: #000 !important; }
      pre, blockquote { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  ${cleanedHtml}
</body>
</html>`;
}

/**
 * Copies rendered formatted text as rich text (HTML + Plaintext) to clipboard
 */
export async function copyRichFormattedText(html: string): Promise<boolean> {
  const cleanedHtml = cleanHtmlForExport(html);
  const parser = new DOMParser();
  const doc = parser.parseFromString(cleanedHtml, 'text/html');
  const plainText = doc.body.innerText || doc.body.textContent || '';

  try {
    if (typeof ClipboardItem !== 'undefined') {
      const blobHtml = new Blob([cleanedHtml], { type: 'text/html' });
      const blobText = new Blob([plainText], { type: 'text/plain' });
      const item = new ClipboardItem({
        'text/html': blobHtml,
        'text/plain': blobText,
      });
      await navigator.clipboard.write([item]);
      return true;
    } else {
      await navigator.clipboard.writeText(plainText);
      return true;
    }
  } catch (err) {
    console.error('Failed to copy rich formatted text:', err);
    try {
      await navigator.clipboard.writeText(plainText);
      return true;
    } catch {
      return false;
    }
  }
}

export async function copyHtmlToClipboard(html: string): Promise<boolean> {
  try {
    const cleaned = cleanHtmlForExport(html);
    await navigator.clipboard.writeText(cleaned);
    return true;
  } catch (err) {
    console.error('Failed to copy HTML to clipboard', err);
    return false;
  }
}
