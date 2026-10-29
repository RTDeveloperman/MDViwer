/**
 * Comprehensive Markdown Guide & Tutorial Data
 * Includes complete syntax, examples, descriptions, and full tutorial markdown document.
 */

export interface GuideItem {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  markdown: string;
  tip?: string;
}

export interface GuideCategory {
  id: string;
  title: string;
  titleEn: string;
  iconName: string;
  description: string;
  items: GuideItem[];
}

export const markdownGuideCategories: GuideCategory[] = [
  {
    id: 'typography',
    title: 'قالب‌بندی و استایل متن',
    titleEn: 'Text Formatting & Typography',
    iconName: 'Type',
    description: 'ابزارهای استاندارد برای ضخیم، کج، خط‌خورده و هایلایت کردن متون فارسی و انگلیسی',
    items: [
      {
        id: 'bold',
        title: 'متن پررنگ (Bold)',
        titleEn: 'Bold Text',
        description: 'برای تاکید و برجسته کردن کلمات کلیدی، متن را بین دو علامت ستاره (**) یا دو زیرخط (__) قرار دهید.',
        markdown: '**این متن پررنگ است** یا __این متن هم پررنگ است__',
        tip: 'کلید میانبر: Ctrl + B',
      },
      {
        id: 'italic',
        title: 'متن مایل یا ایتالیک (Italic)',
        titleEn: 'Italic Text',
        description: 'برای نوشتن اصطلاحات یا کلمات با زاویه مایل، متن را بین یک علامت ستاره (*) یا یک زیرخط (_) قرار دهید.',
        markdown: '*این متن مایل است* یا _این متن هم مایل است_',
        tip: 'کلید میانبر: Ctrl + I',
      },
      {
        id: 'bold-italic',
        title: 'ترکیب پررنگ و مایل (Bold + Italic)',
        titleEn: 'Bold & Italic',
        description: 'برای تاکید شدیدتر، از ۳ ستاره (***) استفاده کنید.',
        markdown: '***این متن هم پررنگ و هم مایل است***',
      },
      {
        id: 'strikethrough',
        title: 'متن خط‌خورده (Strikethrough)',
        titleEn: 'Strikethrough',
        description: 'برای نشان دادن حذفیات یا موارد منسوخ، از دو علامت مدک (~~) در دو طرف متن استفاده کنید.',
        markdown: '~~این متن خط خورده و منسوخ شده است~~',
      },
      {
        id: 'inline-code',
        title: 'کد درون‌خطی (Inline Code)',
        titleEn: 'Inline Code',
        description: 'برای نمایش نام متغیرها، توابع و کدهای کوتاه انگلیسی در میان متن فارسی، از بک‌تیک (`) استفاده کنید تا چینش متن بهم نریزد.',
        markdown: 'برای اجرای برنامه از دستور `npm run dev` و متغیر `const version = "1.0"` استفاده کنید.',
        tip: 'بهترین راهکار برای جلوگیری از پرش کلمات انگلیسی در جملات فارسی!',
      },
      {
        id: 'highlight',
        title: 'هایلایت و ماژیک فسفری (Highlight)',
        titleEn: 'Highlight Text',
        description: 'با استفاده از تگ استاندارد HTML یعنی mark می‌توانید متن را ماژیک‌کشیده و هایلایت کنید.',
        markdown: '<mark>این بخش از متن به رنگ زرد هایلایت شده است</mark>',
      },
      {
        id: 'kbd',
        title: 'کلیدهای کیبورد (Keyboard Key)',
        titleEn: 'Keyboard Shortcut Tag',
        description: 'برای نمایش کلیدهای کیبورد به شکل دکمه‌های سخت‌افزاری شکیل، از تگ kbd استفاده کنید.',
        markdown: 'برای ذخیره سریع کلیدهای <kbd>Ctrl</kbd> + <kbd>S</kbd> را بفشارید.',
      },
      {
        id: 'sub-sup',
        title: 'زیرنویس و بالانویس (Subscript & Superscript)',
        titleEn: 'Subscript & Superscript',
        description: 'برای نوشتن فرمول‌های شیمیایی یا توان‌های ریاضی از تگ‌های sub و sup استفاده کنید.',
        markdown: 'فرمول آب H<sub>2</sub>O و فرمول مساحت دایره πr<sup>2</sup> است.',
      },
    ],
  },
  {
    id: 'headings',
    title: 'عناوین و ساختار سند',
    titleEn: 'Headings & Structure',
    iconName: 'Heading1',
    description: 'تیتربندی استاندارد مقاله از سرتیتر ۱ تا ۶ و خطوط فاصل',
    items: [
      {
        id: 'h1-h6',
        title: 'سرتیترها (Headings ۱ تا ۶)',
        titleEn: 'Headings Level 1 to 6',
        description: 'با گذاشتن علامت # و یک فاصله قبل از متن، اندازه عنوان مشخص می‌شود. هر چه تعداد # بیشتر باشد، عنوان کوچک‌تر می‌شود.',
        markdown: `# سرتیتر اصلی سطح ۱ (Title)
## سرتیتر سطح ۲ (Section)
### سرتیتر سطح ۳ (Sub-section)
#### سرتیتر سطح ۴
##### سرتیتر سطح ۵
###### سرتیتر سطح ۶`,
      },
      {
        id: 'hr',
        title: 'خط افقی جداکننده (Divider)',
        titleEn: 'Horizontal Rule',
        description: 'با گذاشتن سه خط فاصله (---) یا سه ستاره (***) در یک خط مجزا، یک خط افقی زیبا کشیده می‌شود.',
        markdown: `متن بخش اول

---

متن بخش دوم پس از خط جداکننده`,
      },
      {
        id: 'linebreak',
        title: 'شکستن خط و فاصله پاراگراف‌ها',
        titleEn: 'Line Breaks & Paragraphs',
        description: 'برای پاراگراف جدید دو بار اینتر بزنید. اگر می‌خواهید متن بدون فاصله پاراگراف به خط بعد برود، در انتهای خط ۲ اسپیس بزنید یا از <br/> استفاده کنید.',
        markdown: `خط اول این پاراگراف است.<br/>
این خط بلافاصله بعد از خط اول بدون فاصله پاراگرافی می‌آید.

این یک پاراگراف کاملاً جدید و جداست.`,
      },
    ],
  },
  {
    id: 'lists',
    title: 'لیست‌ها و چک‌لیست وظایف',
    titleEn: 'Lists & Task Lists',
    iconName: 'ListOrdered',
    description: 'لیست‌های گلوله‌ای، شماره‌دار و تسک‌های قابل تیک زدن',
    items: [
      {
        id: 'unordered-list',
        title: 'لیست نامرتب یا گلوله‌ای (Bullet List)',
        titleEn: 'Unordered List',
        description: 'با قرار دادن خط تیره (-) یا علامت ستاره (*) در ابتدای هر سطر یک لیست گلوله‌ای ایجاد می‌شود.',
        markdown: `- آیتم اول فهرست
- آیتم دوم فهرست
  - زیرمجموعه اول (با زدن ۲ یا ۴ فاصله)
  - زیرمجموعه دوم
- آیتم سوم فهرست`,
      },
      {
        id: 'ordered-list',
        title: 'لیست شماره‌دار ترتیبی (Numbered List)',
        titleEn: 'Ordered List',
        description: 'با قرار دادن عدد و نقطه (مثل 1.) در ابتدای خط ایجاد می‌شود. مارک‌داون شماره‌ها را مرتب می‌کند.',
        markdown: `1. گام اول: نصب نرم‌افزار
2. گام دوم: باز کردن پروژه
3. گام سوم: شروع نوشتن
   1. زیرگام ۳-۱
   2. زیرگام ۳-۲`,
      },
      {
        id: 'task-list',
        title: 'چک‌لیست وظایف (Task List / Checkbox)',
        titleEn: 'Task List / Checkboxes',
        description: 'برای فهرست انجام کارها (ToDo) از - [ ] برای تیک‌نخورده و - [x] برای انجام‌شده استفاده کنید.',
        markdown: `- [x] طراحی رابط کاربری برنامه
- [x] پیاده‌سازی موتور خروجی PDF و DOCX
- [ ] تست نهایی روی نسخه‌های مختلف ویندوز
- [ ] انتشار نسخه جدید در گیت‌هاب`,
      },
    ],
  },
  {
    id: 'quotes-callouts',
    title: 'نقل‌قول‌ها و کادرهای نکته',
    titleEn: 'Quotes & Callouts',
    iconName: 'Quote',
    description: 'نمایش سخنان، پندها و کادرهای رنگی توجه و هشدار',
    items: [
      {
        id: 'quote',
        title: 'نقل‌قول ساده و چندخطی (Blockquote)',
        titleEn: 'Blockquote',
        description: 'با قرار دادن علامت < در ابتدای خط، متن به صورت نقل‌قول برجسته با حاشیه رنگی زیبا درمی‌آید.',
        markdown: `> سادگی نهایت پیچیدگی و هنر است.
> 
> — لئوناردو داوینچی`,
      },
      {
        id: 'nested-quote',
        title: 'نقل‌قول‌های تودرتو (Nested Quote)',
        titleEn: 'Nested Blockquotes',
        description: 'با تکرار علامت << می‌توانید نقل‌قول را در چند سطح عمق بدهید.',
        markdown: `> نقل‌قول سطح اول
>> نقل‌قول داخلی و منسوب به شخص دیگر
>>> نکته فرعی درون نقل‌قول`,
      },
      {
        id: 'callouts',
        title: 'کادرهای اختصاصی توجه و هشدار (Alerts & Callouts)',
        titleEn: 'Callouts / Alerts',
        description: 'می‌توانید کادرهای توجه، نکته و هشدار را با ترکیب ایموجی یا فرمت گیت‌هاب بسازید.',
        markdown: `> 💡 **نکته مهم:** همیشه قبل از خروجی گرفتن، فایل خود را با Ctrl+S ذخیره کنید.

> ⚠️ **هشدار:** تغییر ساختار جدول ممکن است باعث به هم ریختن چیدمان ستون‌ها شود.

> ℹ️ **اطلاعیه:** این نرم‌افزار به صورت خودکار جهت متن فارسی را تشخیص می‌دهد.`,
      },
    ],
  },
  {
    id: 'links-images',
    title: 'پیوندها و تصاویر',
    titleEn: 'Links & Images',
    iconName: 'Link2',
    description: 'افزودن لینک‌های اینترنتی و تصاویر محلی یا آنلاین',
    items: [
      {
        id: 'link',
        title: 'لینک متن‌دار (Hyperlink)',
        titleEn: 'Hyperlink',
        description: 'متن قابل کلیک را داخل براکت [ ] و آدرس اینترنتی را داخل پرانتز ( ) قرار دهید.',
        markdown: '[وبسایت رسمی مارک‌داون](https://www.markdownguide.org) یا [مخزن گیت‌هاب](https://github.com)',
      },
      {
        id: 'link-title',
        title: 'لینک همراه با راهنما (Tooltip)',
        titleEn: 'Link with Tooltip',
        description: 'می‌توانید بعد از آدرس، متنی را داخل کوتیشن بنویسید تا هنگام بردن موس روی لینک ظاهر شود.',
        markdown: '[دانلود آخرین نسخه](https://github.com "دانلود فایل‌های نصبی برای ویندوز")',
      },
      {
        id: 'image',
        title: 'درج تصویر (Image)',
        titleEn: 'Image',
        description: 'مانند لینک است، فقط یک علامت تعجب (!) در ابتدای براکت قرار می‌گیرد.',
        markdown: '![تصویر طبیعت](https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=700)',
      },
      {
        id: 'clickable-image',
        title: 'تصویر کلیک‌خور (Clickable Image Link)',
        titleEn: 'Clickable Image',
        description: 'ترکیب تصویر و لینک؛ عکس را داخل براکت لینک قرار دهید تا با کلیک روی عکس، لینک باز شود.',
        markdown: '[![توضیح لوگو](https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200)](https://github.com)',
      },
    ],
  },
  {
    id: 'tables',
    title: 'جداول و ماتریس اطلاعات',
    titleEn: 'Tables & Alignment',
    iconName: 'Table',
    description: 'ساخت جدول‌های شکیل همراه با تعیین چینش راست، وسط یا چپ برای هر ستون',
    items: [
      {
        id: 'table-basic',
        title: 'جدول کامل با تراز ستون‌ها (Table)',
        titleEn: 'Complete Table with Alignment',
        description: 'ستون‌ها با خط عمودی (|) جدا می‌شوند. در خط دوم با استفاده از دو نقطه (:) جهت تراز ستون مشخص می‌شود.',
        markdown: `| نام ابزار | نقش در پروژه | جهت ستون | وضعیت |
| :--- | :---: | ---: | :---: |
| React 18 | فرانت‌اند و رابط کاربری | راست‌چین | ✅ پایدار |
| KaTeX | رندر فرمول‌های ریاضی | وسط‌چین | ⚡ سریع |
| Mermaid | رسم نمودار و فلوچارت | چپ‌چین | 📊 تعاملی |`,
      },
      {
        id: 'table-formatting',
        title: 'فرمت‌بندی داخل سلول‌های جدول',
        titleEn: 'Formatting inside Table Cells',
        description: 'شما می‌توانید داخل سلول‌های جدول از پررنگ، مایل، کد درون‌خطی و حتی ایموجی استفاده کنید.',
        markdown: `| دستور | کلید میانبر | توضیحات |
| :--- | :---: | :--- |
| \`save\` | <kbd>Ctrl</kbd> + <kbd>S</kbd> | **ذخیره سند فعال** |
| \`new\` | <kbd>Ctrl</kbd> + <kbd>N</kbd> | _ایجاد تب جدید_ |
| \`open\` | <kbd>Ctrl</kbd> + <kbd>O</kbd> | باز کردن فایل \`.md\` |`,
      },
    ],
  },
  {
    id: 'code',
    title: 'بلوک‌های کد و برنامه‌نویسی',
    titleEn: 'Code Blocks & Syntax',
    iconName: 'Code',
    description: 'نمایش کدهای برنامه‌نویسی همراه با هایلایت رنگی کلمات کلیدی و دکمه کپی',
    items: [
      {
        id: 'code-ts',
        title: 'کد تایپ‌اسکریپت و جاوااسکریپت',
        titleEn: 'TypeScript / JavaScript',
        description: 'سه بار علامت بک‌تیک و نوشتن کلمه typescript یا ts در بالای بلوک.',
        markdown: `\`\`\`typescript
interface UserProfile {
  id: number;
  name: string;
  isPersian: boolean;
}

const welcomeUser = (user: UserProfile): string => {
  return \`درود بر \${user.name}! به دنیای مارک‌داون خوش آمدید.\`;
};
\`\`\``,
      },
      {
        id: 'code-python',
        title: 'کد پایتون (Python)',
        titleEn: 'Python Code',
        description: 'نوشتن کلمه python در ابتدای بلوک کد برای برجسته‌سازی کدهای پایتون.',
        markdown: `\`\`\`python
def calculate_factorial(n: int) -> int:
    """محاسبه فاکتوریل یک عدد طبیعی"""
    if n <= 1:
        return 1
    return n * calculate_factorial(n - 1)

print("Factorial of 5:", calculate_factorial(5))
\`\`\``,
      },
      {
        id: 'code-sql',
        title: 'کد پایگاه داده (SQL)',
        titleEn: 'SQL Queries',
        description: 'بلوک کد مخصوص دستورات پایگاه داده و کوئری‌ها.',
        markdown: `\`\`\`sql
SELECT 
    id, 
    title, 
    created_at 
FROM documents 
WHERE status = 'published' 
ORDER BY created_at DESC;
\`\`\``,
      },
      {
        id: 'code-html',
        title: 'کد HTML و وب',
        titleEn: 'HTML & Markup',
        description: 'برای نمایش کدهای نشانه‌گذاری صفحات وب.',
        markdown: `\`\`\`html
<div class="card shadow-lg p-4 rounded-xl">
  <h2 class="text-xl font-bold">عنوان کارت فارسی</h2>
  <p>توضیحات مربوط به محتوای این بخش.</p>
</div>
\`\`\``,
      },
    ],
  },
  {
    id: 'math',
    title: 'فرمول‌های ریاضی و علمی (KaTeX)',
    titleEn: 'Math Formulas (KaTeX)',
    iconName: 'Sigma',
    description: 'نوشتن فرمول‌های دانشگاهی، کسرها، انتگرال‌ها و ماتریس‌ها با دقت بسیار بالا',
    items: [
      {
        id: 'math-inline',
        title: 'ریاضی درون‌خطی (Inline Math)',
        titleEn: 'Inline Math',
        description: 'قرار دادن فرمول درون یک جفت علامت دلار ($فرمول$).',
        markdown: 'رابطه هم‌ارزی جرم و انرژی اینشتین $E = mc^2$ است و قضیه فیثاغورس $a^2 + b^2 = c^2$ می‌باشد.',
      },
      {
        id: 'math-quadratic',
        title: 'حل معادله درجه دوم و کسرها',
        titleEn: 'Fractions & Roots',
        description: 'فرمول‌های بلوکی مستقل با دو علامت دلار ($$) در خطوط جداگانه نوشته می‌شوند.',
        markdown: `$$
x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}
$$`,
      },
      {
        id: 'math-integral',
        title: 'انتگرال و حد (Integrals & Limits)',
        titleEn: 'Integrals & Limits',
        description: 'نمایش انتگرال معین، نامعین و روابط مشتق و حد.',
        markdown: `$$
\\int_{-\\infty}^{+\\infty} e^{-x^2} dx = \\sqrt{\\pi} \\quad , \\quad \\lim_{x \\to 0} \\frac{\\sin x}{x} = 1
$$`,
      },
      {
        id: 'math-matrix',
        title: 'ماتریس‌ها و بردارها (Matrices)',
        titleEn: 'Matrices',
        description: 'تعریف ماتریس‌های ریاضی با پرانتز یا کروشه.',
        markdown: `$$
\\begin{pmatrix}
a_{11} & a_{12} & a_{13} \\\\
a_{21} & a_{22} & a_{23} \\\\
a_{31} & a_{32} & a_{33}
\\end{pmatrix}
$$`,
      },
    ],
  },
  {
    id: 'diagrams',
    title: 'نمودارها و فلوچارت (Mermaid)',
    titleEn: 'Interactive Diagrams (Mermaid)',
    iconName: 'GitGraph',
    description: 'رسم خودکار نمودارهای فرآیندی، توالی و آماری بدون نیاز به کشیدن دستی',
    items: [
      {
        id: 'mermaid-flowchart',
        title: 'فلوچارت فرآیندی (Flowchart)',
        titleEn: 'Flowchart',
        description: 'تعریف نمودار درختی یا گره‌های تصمیم‌گیری از بالا به پایین (TD) یا چپ به راست (LR).',
        markdown: `\`\`\`mermaid
graph TD
  A[شروع نوشتن فایل مارک‌داون] --> B{آیا متن نیاز به فرمت دارد؟}
  B -->|بله| C[استفاده از ابزارهای نوار ابزار]
  B -->|خیر| D[تایپ مستقیم متن ساده]
  C --> E[مشاهده پیش‌نمایش آنی]
  D --> E
  E --> F[خروجی زیبا به PDF یا Word]
\`\`\``,
      },
      {
        id: 'mermaid-pie',
        title: 'نمودار دایره‌ای آماری (Pie Chart)',
        titleEn: 'Pie Chart',
        description: 'نمایش سهم درصد یا دسته‌بندی داده‌ها به صورت نمودار دایره‌ای زیبا.',
        markdown: `\`\`\`mermaid
pie title سهم استفاده از زبان‌ها در پروژه
  "TypeScript / React" : 65
  "Tailwind CSS" : 20
  "Markdown & KaTeX" : 15
\`\`\``,
      },
      {
        id: 'mermaid-sequence',
        title: 'نمودار توالی تعاملات (Sequence Diagram)',
        titleEn: 'Sequence Diagram',
        description: 'نمایش پیام‌ها و ارتباط بین چند موجودیت (مثلاً کاربر، نرم‌افزار و سیستم‌عامل).',
        markdown: `\`\`\`mermaid
sequenceDiagram
  autonumber
  actor کاربر
  participant ویرایشگر as MDGhashange
  participant سیستم as Windows OS
  
  کاربر->>ویرایشگر: فشردن دکمه خروجی PDF
  ویرایشگر->>سیستم: رندر برداری و ذخیره فایل
  سیستم-->>ویرایشگر: تایید ذخیره موفق
  ویرایشگر-->>کاربر: نمایش پیام سبز رنگ موفقیت
\`\`\``,
      },
    ],
  },
  {
    id: 'persian-tips',
    title: 'ترفندهای زبان فارسی و راست‌چین',
    titleEn: 'Persian & RTL Best Practices',
    iconName: 'Languages',
    description: 'اصول حرفه‌ای برای جلوگیری از بهم‌ریختگی جملات ترکیبی فارسی و انگلیسی',
    items: [
      {
        id: 'bidi-isolation',
        title: 'کلمات انگلیسی در جملات فارسی',
        titleEn: 'English Words in Persian Sentences',
        description: 'وقتی یک کلمه یا مسیر انگلیسی را بین دو علامت بک‌تیک (`) قرار می‌دهید، موتور BiDi آن را به عنوان یک جزیره مجزا می‌شناسد و کلمات قبل و بعد آن وارونه یا جابه‌جا نمی‌شوند.',
        markdown: `❌ نادرست: برای شروع npm start را در دایرکتوری src وارد نمایید.
✔️ درست: برای شروع \`npm start\` را در دایرکتوری \`src\` وارد نمایید.`,
      },
      {
        id: 'punctuation',
        title: 'علائم نگارشی، پرانتزها و نقطه پایانی',
        titleEn: 'Punctuation & Parentheses',
        description: 'اگر انتهای جمله شما با کلمه یا عدد انگلیسی پایان یابد، نقطه ممکن است به سمت راست پرش کند. قرار دادن فاصله مجازی (نیم‌فاصله) یا کد درون‌خطی این مشکل را حل می‌کند.',
        markdown: `این پروژه بر پایه فناوری \`Electron\` و کتابخانه \`React 18\` ساخته شده است. (نسخه پایدار)`,
      },
      {
        id: 'custom-direction',
        title: 'تغییر جهت تب (RTL / LTR)',
        titleEn: 'Tab Direction Switching',
        description: 'در نوار ابزار بالا، دکمه‌های تراز راست (RTL) و تراز چپ (LTR) وجود دارند. اگر متنی تماماً انگلیسی می‌نویسید جهت را روی LTR و اگر فارسی می‌نویسید روی RTL بگذارید.',
        markdown: 'برای اسناد فارسی از دکمه تراز راست و برای پروژه‌های انگلیسی یا کدنویسی محض از دکمه چپ‌چین استفاده کنید.',
      },
    ],
  },
];

/**
 * Full, self-contained Markdown tutorial file that can be opened into a new tab
 */
export const fullMarkdownTutorialDocument = `# 📘 راهنمای جامع و صفر تا صد مارک‌داون (Markdown Cheat Sheet)
به آموزش تعاملی مارک‌داون در **MDGhashange** خوش آمدید!  
مارک‌داون یک زبان نشانه‌گذاری بسیار سبک، خوانا و محبوب برای نوشتن اسناد، مستندات نرم‌افزاری، مقالات علمی و متون دوزبانه است.

این سند را می‌توانید مستقیماً در همین برنامه ویرایش کنید و تغییرات را به صورت زنده در پنل پیش‌نمایش ببینید!

---

## ۱. قالب‌بندی متون (Text Formatting)

برای تغییر شکل ظاهری کلمات از این الگوها استفاده کنید:

- **متن پررنگ (Bold):** با دو ستاره \`**متن پررنگ**\`
- *متن کج یا مایل (Italic):* با یک ستاره \`*متن مایل*\`
- ***متن هم پررنگ و هم مایل:*** با سه ستاره \`***متن ترکیبی***\`
- ~~متن خط‌خورده (Strikethrough):~~ با دو علامت مدک \`~~متن خط‌خورده~~\`
- <mark>متن هایلایت شده و ماژیک‌کشیده:</mark> با تگ \`<mark>متن هایلایت</mark>\`
- فرمول‌های کوچک مثل H<sub>2</sub>O با \`<sub>2</sub>\` و مساحت $X^2$ با \`<sup>2</sup>\`
- کلیدهای میانبر شکیل کیبورد: <kbd>Ctrl</kbd> + <kbd>S</kbd> با تگ \`<kbd>Ctrl</kbd>\`
- کد کوتاه یا اصطلاح انگلیسی وسط جمله: \`const app = true;\` با بک‌تیک \`

---

## ۲. عناوین و تیترها (Headings)

سرتیترها با تعداد علامت \`#\` مشخص می‌شوند:

# سرتیتر ۱: بزرگ‌ترین تیتر سند
## سرتیتر ۲: تیتر بخش‌های اصلی
### سرتیتر ۳: زیربخش‌های تیتر ۲
#### سرتیتر ۴: تیتر جزیی
##### سرتیتر ۵
###### سرتیتر ۶: کوچک‌ترین سرتیتر

---

## ۳. لیست‌ها و وظایف (Lists & Tasks)

### الف) لیست نشانه‌دار (گلوله‌ای):
- آیتم اول
- آیتم دوم
  - زیرشاخه اول (با یک Tab یا چند فاصله)
  - زیرشاخه دوم
- آیتم سوم

### ب) لیست ترتیبی و شماره‌دار:
1. مرحله اول: باز کردن برنامه
2. مرحله دوم: نوشتن متن مارک‌داون
3. مرحله سوم: خروجی به PDF یا Word

### ج) چک‌لیست کارهای انجام‌شده و باقی‌مانده (Task List):
- [x] دانلود و اجرای نرم‌افزار MDGhashange
- [x] مطالعه راهنمای مارک‌داون
- [ ] نوشتن اولین یادداشت شخصی
- [ ] ذخیره و خروجی گرفتن به فرمت دلخواه

---

## ۴. نقل‌قول‌ها و نکات برجسته (Blockquotes & Callouts)

> این یک نقل‌قول ساده است.  
> می‌توانید در هر کجای متن برای جلب توجه مخاطب از آن استفاده کنید.

> 💡 **نکته کلیدی:**  
> اگر متنی می‌نویسید که ترکیب فارسی و کدهای انگلیسی است، کلمات انگلیسی را همیشه داخل \`کد درون‌خطی\` قرار دهید تا جهت متن کاملاً درست و خوانا بماند.

> ⚠️ **هشدار:**  
> پیش از بستن برنامه، مطمئن شوید که تب شما ذخیره شده است (علامت آبی‌رنگ ذخیره خاموش شده باشد).

---

## ۵. پیوندها و تصاویر (Links & Images)

- پیوند مستقیم: [وبسایت مارک‌داون](https://www.markdownguide.org)
- پیوند همراه با توضیح شناور: [مخزن گیت‌هاب پروژه](https://github.com "مشاهده سورس‌کد در گیت‌هاب")
- تصویر دلخواه با توضیح جایگزین:

![تصویر زیبای رنگین‌کمانی](https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800)

---

## ۶. جداول زیبا (Tables)

جداول در مارک‌داون با خطوط عمودی \`|\` ساخته می‌شوند. جهت هر ستون با \`:\` تعیین می‌شود:

| نام قابلیت | کاربرد | تراز ستون | امتیاز |
| :--- | :---: | ---: | :---: |
| خروجی PDF | چاپ سند بدون به هم ریختگی فونت | راست | ⭐️⭐️⭐️⭐️⭐️ |
| خروجی HTML | انتشار اینترنتی سند با استایل کامل | وسط | ⭐️⭐️⭐️⭐️⭐️ |
| خروجی Word | ویرایش نهایی در نرم‌افزار مایکروسافت ورد | چپ | ⭐️⭐️⭐️⭐️ |
| پشتیبانی ریاضی | رندر فرمول‌های علمی و فیزیکی | وسط | ⭐️⭐️⭐️⭐️⭐️ |

---

## ۷. قطعات کد و برنامه‌نویسی (Code Blocks)

با استفاده از سه بک‌تیک \`\`\` و ذکر نام زبان، کدهای شما با رنگ‌بندی حرفه‌ای نمایش داده می‌شوند:

\`\`\`typescript
// مثال کد TypeScript
interface DocumentState {
  title: string;
  wordCount: number;
  isPersian: boolean;
}

function printSummary(doc: DocumentState): void {
  console.log(\`سند "\${doc.title}" شامل \${doc.wordCount} واژه است.\`);
}
\`\`\`

\`\`\`python
# مثال کد پایتون
def is_even(number: int) -> bool:
    return number % 2 == 0

numbers = [1, 2, 3, 4, 5, 6]
evens = list(filter(is_even, numbers))
print("اعداد زوج:", evens)
\`\`\`

---

## ۸. فرمول‌های ریاضی و علمی (KaTeX)

فرمول‌های ریاضی هم به صورت درون‌خطی و هم به صورت بلوک‌های بزرگ وسط‌چین پشتیبانی می‌شوند:

- فرمول انرژی اینشتین درون متن: $E = mc^2$
- رابطه فیثاغورس: $c = \\sqrt{a^2 + b^2}$

### فرمول‌های مستقل و چندخطی:

$$
x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}
$$

فرمول معروف گوس و مساحت منحنی نرمال:

$$
\\int_{-\\infty}^{+\\infty} e^{-x^2} dx = \\sqrt{\\pi}
$$

ماتریس ضرایب:

$$
A = \\begin{bmatrix}
1 & 2 & 3 \\\\
4 & 5 & 6 \\\\
7 & 8 & 9
\\end{bmatrix}
$$

---

## ۹. رسم انواع نمودارها با Mermaid

نیازی به رسم شکل در برنامه‌های دیگر ندارید! کافی است نوع نمودار را با متن توصیف کنید:

### ۱. فلوچارت تصمیم‌گیری:
\`\`\`mermaid
graph TD
  Start([ورود کاربر به MDGhashange]) --> Edit[تایپ و ویرایش فایل]
  Edit --> Check{آیا کار به پایان رسید؟}
  Check -->|خیر| Edit
  Check -->|بله| Export[انتخاب خروجی PDF یا Word]
  Export --> Finish([خروج با رضایت کامل 🎉])
\`\`\`

### ۲. نمودار دایره‌ای آماری:
\`\`\`mermaid
pie title توزیع محتوای یک مقاله استاندارد
  "متن و توضیحات" : 50
  "کدها و اسکریپت‌ها" : 25
  "نمودارها و تصاویر" : 15
  "جداول داده" : 10
\`\`\`

---

## ۱۰. کلیدهای میانبر پرکاربرد در MDGhashange

| کلید میانبر | عملکرد |
| :---: | :--- |
| <kbd>F1</kbd> | **باز کردن راهنما و آموزش کامل مارک‌داون** |
| <kbd>Ctrl</kbd> + <kbd>N</kbd> | ایجاد تب جدید |
| <kbd>Ctrl</kbd> + <kbd>O</kbd> | باز کردن فایل مارک‌داون از روی کامپیوتر |
| <kbd>Ctrl</kbd> + <kbd>S</kbd> | ذخیره سریع فایل جاری |
| <kbd>Ctrl</kbd> + <kbd>B</kbd> | پررنگ کردن متن انتخاب شده (Bold) |
| <kbd>Ctrl</kbd> + <kbd>I</kbd> | مایل کردن متن انتخاب شده (Italic) |
| <kbd>Ctrl</kbd> + <kbd>,</kbd> | باز کردن پنل تنظیمات و فونت‌ها |

---
**پایان آموزش!**  
اکنون می‌توانید هر کجای این فایل را تغییر دهید و پیش‌نمایش زنده را در سمت راست تجربه کنید.
`;
