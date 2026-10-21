/**
 * Markdown insertion helpers and templates
 */

export interface SnippetAction {
  prefix: string;
  suffix: string;
  defaultText: string;
}

export const markdownSnippets = {
  bold: { prefix: '**', suffix: '**', defaultText: 'متن پررنگ' },
  italic: { prefix: '*', suffix: '*', defaultText: 'متن مایل' },
  strikethrough: { prefix: '~~', suffix: '~~', defaultText: 'متن خط‌خورده' },
  h1: { prefix: '# ', suffix: '', defaultText: 'عنوان سطح ۱' },
  h2: { prefix: '## ', suffix: '', defaultText: 'عنوان سطح ۲' },
  h3: { prefix: '### ', suffix: '', defaultText: 'عنوان سطح ۳' },
  quote: { prefix: '> ', suffix: '', defaultText: 'نقل قول یا نکته مهم' },
  codeInline: { prefix: '`', suffix: '`', defaultText: 'کد درون‌خطی' },
  codeBlock: {
    prefix: '```typescript\n',
    suffix: '\n```',
    defaultText: '// قطعه کد خود را اینجا بنویسید\nconst greeting = "سلام به دنیای مارک‌داون";\nconsole.log(greeting);',
  },
  link: { prefix: '[', suffix: '](https://example.com)', defaultText: 'متن پیوند' },
  image: { prefix: '![', suffix: '](https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800)', defaultText: 'توضیح تصویر' },
  table: {
    prefix:
      '| عنوان اول | عنوان دوم | وضعیت |\n| :--- | :---: | ---: |\n| داده ۱ | آیتم آ | ✅ تایید شده |\n| داده ۲ | آیتم ب | ⏳ در حال بررسی |\n',
    suffix: '',
    defaultText: '',
  },
  checklist: {
    prefix: '- [ ] ',
    suffix: '\n- [x] وظیفه تکمیل شده\n- [ ] وظیفه بعدی',
    defaultText: 'وظیفه جدید',
  },
  mathInline: { prefix: '$', suffix: '$', defaultText: 'E = mc^2' },
  mathBlock: {
    prefix: '$$\n',
    suffix: '\n$$',
    defaultText: '\\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}',
  },
  mermaid: {
    prefix: '```mermaid\ngraph TD\n  ',
    suffix: '\n```',
    defaultText: 'A[شروع فرآیند] --> B{آیا شرط برقرار است؟}\n  B -->|بله| C[انجام عملیات موفق]\n  B -->|خیر| D[نمایش خطا]\n  C --> E[پایان]',
  },
};

export const sampleMarkdown = `# خوش‌آمدید به MDGhashange 🌟
یک نمایشگر و ویرایشگر پیشرفته، چشم‌نواز و دو زبانه برای فایل‌های **Markdown (.md)** با خروجی‌های شکیل و استانداردهای دسکتاپ.

---

## 🚀 ویژگی‌های کلیدی این نسخه
1. 📂 **پشتیبانی از Open with در ویندوز:** باز شدن خودکار فایل‌ها با راست‌کلیک روی فایل \`.md\` و انتخاب برنامه.
2. 🖨️ **خروجی سه‌گانه زیبا (فقط از پیش‌نمایش رندرشده):**
   - 📄 خروجی **PDF برداری با کیفیت عالی**
   - 🌐 خروجی **HTML مستقل با استایل‌های کامل**
   - 📘 خروجی **Microsoft Word (DOCX) فرمت‌بندی شده**
3. 🖱️ **بستن تب‌ها با کلیک وسط موس:** دقیقاً همانند مرورگرهای مدرن مانند Chrome!
4. 📋 **کپی چندگانه:** دکمه کپی متن فرمت‌شده برای Paste مستقیم در Word یا تلگرام، کپی HTML و کپی کد منبع.
5. 🔍 **راست‌کلیک نیتیو:** پشتیبانی از منوی راست‌کلیک Cut / Copy / Paste / Select All در همه جای برنامه.
6. 📐 **فرمول‌های ریاضی (KaTeX) و دیاگرام‌های Mermaid**


---

## 📐 فرمول‌های ریاضی و علمی
شما می‌توانید فرمول‌های درون‌خطی مانند $f(x) = \\int_{-\\infty}^x e^{-t^2} dt$ یا بلوک‌های مستقل ریاضی بنویسید:

$$
\\sigma = \\sqrt{\\frac{1}{N} \\sum_{i=1}^N (x_i - \\mu)^2}
$$

قانون معروف اینشتین:
$$
E = mc^2
$$

---

## 📊 دیاگرام تعاملی با Mermaid

\`\`\`mermaid
graph LR
  A[نوشتن فایل MD] --> B(تحلیل سینتکس)
  B --> C{آیا زبان فارسی است؟}
  C -->|بله| D[اعمال هوشمند فونت وزیر و راست‌چین]
  C -->|خیر| E[اعمال استاندارد چپ‌چین LTR]
  D --> F[پیش‌نمایش زیبا و خروجی PDF]
  E --> F
\`\`\`

---

## 💻 قطعه کد با هایلایت سینتکس

\`\`\`typescript
interface PersianEditorProps {
  theme: 'dark' | 'light';
  direction: 'rtl' | 'ltr';
  autoSaveInterval: number;
}

function initializeEditor(props: PersianEditorProps): void {
  console.log("ویرایشگر آماده به کار شد:", props);
}
\`\`\`

---

## 📋 جدول و لیست وظایف

| امکانات | وضعیت | اولویت |
| :--- | :---: | ---: |
| تشخیص خودکار جهت متن | ✅ انجام شد | حیاتی |
| خروجی به PDF و HTML | ✅ انجام شد | بالا |
| تم تاریک و روشن شیشه‌ای | ✅ انجام شد | متوسط |
| مدیریت چند تب همزمان | ✅ انجام شد | بالا |

- [x] دانلود و بررسی پروژه PersianMD
- [x] تست نوشتن متن فارسی و انگلیسی ترکیبی
- [ ] تست خروجی PDF و چاپ
- [ ] ستاره دادن به پروژه!

> 💡 **نکته:** برای تجربه بهتر می‌توانید از کلیدهای میانبر \`Ctrl + S\` برای ذخیره و \`Ctrl + B\` برای پررنگ کردن متن استفاده نمایید.
`;
