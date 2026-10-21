import { app, BrowserWindow, ipcMain, dialog, shell, Menu, MenuItem } from 'electron';
import * as path from 'path';
import * as fs from 'fs/promises';
import HTMLtoDOCX from 'html-to-docx';
import JSZip from 'jszip';

let mainWindow: BrowserWindow | null = null;
let initialFilePath: string | null = null;

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

// Extract file path from CLI arguments for "Open with" / double click
function getFilePathFromArgs(args: string[]): string | null {
  for (const arg of args) {
    if (
      arg &&
      !arg.startsWith('--') &&
      !arg.endsWith('.exe') &&
      !arg.endsWith('.js') &&
      /\.(md|markdown|mdown|mkd|txt)$/i.test(arg)
    ) {
      return path.resolve(arg);
    }
  }
  return null;
}

// Single Instance Lock for handling "Open with" in existing window
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (_event, commandLine) => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();

      const fileToOpen = getFilePathFromArgs(commandLine);
      if (fileToOpen) {
        openFileInRenderer(fileToOpen);
      }
    }
  });
}

// Catch initial file argument on startup
initialFilePath = getFilePathFromArgs(process.argv);

interface FileNode {
  name: string;
  path: string;
  isDirectory: boolean;
  children?: FileNode[];
}

async function scanDirectory(dirPath: string, maxDepth = 4, currentDepth = 0): Promise<FileNode[]> {
  if (currentDepth > maxDepth) return [];
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    const nodes: FileNode[] = [];

    const filtered = entries.filter((e) => !e.name.startsWith('.') && e.name !== 'node_modules' && e.name !== 'dist');
    filtered.sort((a, b) => {
      if (a.isDirectory() && !b.isDirectory()) return -1;
      if (!a.isDirectory() && b.isDirectory()) return 1;
      return a.name.localeCompare(b.name);
    });

    for (const entry of filtered) {
      const fullPath = path.join(dirPath, entry.name);
      if (entry.isDirectory()) {
        const children = await scanDirectory(fullPath, maxDepth, currentDepth + 1);
        nodes.push({ name: entry.name, path: fullPath, isDirectory: true, children });
      } else {
        nodes.push({ name: entry.name, path: fullPath, isDirectory: false });
      }
    }
    return nodes;
  } catch (err) {
    console.error('Error scanning directory:', err);
    return [];
  }
}

async function openFileInRenderer(filePath: string) {
  if (!mainWindow) return;
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    mainWindow.webContents.send('app:openFileFromCli', {
      filePath,
      fileName: path.basename(filePath),
      content,
    });
  } catch (err) {
    console.error('Failed to read file for renderer:', err);
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 840,
    minWidth: 900,
    minHeight: 600,
    backgroundColor: '#0f172a',
    title: 'MDGhashange | ویرایشگر و نمایشگر حرفه‌ای مارک‌داون',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      webSecurity: false,
    },
    show: false,
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
    if (initialFilePath) {
      setTimeout(() => {
        if (initialFilePath) openFileInRenderer(initialFilePath);
      }, 1000);
    }
  });

  // Windows Right-click context menu (Cut, Copy, Paste, Select All)
  mainWindow.webContents.on('context-menu', (_event, params) => {
    const menu = new Menu();

    if (params.isEditable) {
      menu.append(new MenuItem({ label: 'برش (Cut)', role: 'cut' }));
      menu.append(new MenuItem({ label: 'کپی (Copy)', role: 'copy' }));
      menu.append(new MenuItem({ label: 'جای‌گذاری (Paste)', role: 'paste' }));
      menu.append(new MenuItem({ type: 'separator' }));
      menu.append(new MenuItem({ label: 'انتخاب همه (Select All)', role: 'selectAll' }));
      menu.popup();
    } else if (params.selectionText) {
      menu.append(new MenuItem({ label: 'کپی (Copy)', role: 'copy' }));
      menu.append(new MenuItem({ type: 'separator' }));
      menu.append(new MenuItem({ label: 'انتخاب همه (Select All)', role: 'selectAll' }));
      menu.popup();
    }
  });

  // External links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http:') || url.startsWith('https:')) {
      shell.openExternal(url);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  setupIpcHandlers();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

function setupIpcHandlers() {
  // Get initial file if opened via "Open with"
  ipcMain.handle('app:getInitialFile', async () => {
    if (!initialFilePath) return null;
    try {
      const content = await fs.readFile(initialFilePath, 'utf-8');
      const fileData = {
        filePath: initialFilePath,
        fileName: path.basename(initialFilePath),
        content,
      };
      initialFilePath = null; // Consume
      return fileData;
    } catch {
      return null;
    }
  });

  // Dialog: Open File
  ipcMain.handle('dialog:openFile', async () => {
    if (!mainWindow) return null;
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
      title: 'باز کردن فایل مارک‌داون / Open Markdown File',
      properties: ['openFile'],
      filters: [
        { name: 'Markdown Files (*.md, *.markdown)', extensions: ['md', 'markdown', 'mdown', 'mkd', 'txt'] },
        { name: 'All Files (*.*)', extensions: ['*'] },
      ],
    });

    if (canceled || filePaths.length === 0) return null;
    const filePath = filePaths[0];
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      return { filePath, fileName: path.basename(filePath), content };
    } catch (err: any) {
      return { error: err.message };
    }
  });

  // Dialog: Open Folder
  ipcMain.handle('dialog:openFolder', async () => {
    if (!mainWindow) return null;
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
      title: 'باز کردن پوشه پروژه / Open Workspace Folder',
      properties: ['openDirectory'],
    });

    if (canceled || filePaths.length === 0) return null;
    const folderPath = filePaths[0];
    const tree = await scanDirectory(folderPath);
    return { folderPath, folderName: path.basename(folderPath), tree };
  });

  // Read File
  ipcMain.handle('fs:readFile', async (_event, filePath: string) => {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      return { content, fileName: path.basename(filePath) };
    } catch (err: any) {
      return { error: err.message };
    }
  });

  // Write File
  ipcMain.handle('fs:writeFile', async (_event, { filePath, content }: { filePath: string; content: string }) => {
    try {
      await fs.writeFile(filePath, content, 'utf-8');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  });

  // Save File As
  ipcMain.handle('dialog:saveFileAs', async (_event, { defaultName, content }: { defaultName?: string; content: string }) => {
    if (!mainWindow) return null;
    const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
      title: 'ذخیره فایل با نام جدید / Save File As',
      defaultPath: defaultName || 'untitled.md',
      filters: [
        { name: 'Markdown (*.md)', extensions: ['md'] },
        { name: 'Text file (*.txt)', extensions: ['txt'] },
        { name: 'All Files (*.*)', extensions: ['*'] },
      ],
    });

    if (canceled || !filePath) return null;
    try {
      await fs.writeFile(filePath, content, 'utf-8');
      return { filePath, fileName: path.basename(filePath), success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  });

  // Export to PDF (Rendered preview only)
  ipcMain.handle('export:pdf', async (_event, defaultName?: string) => {
    if (!mainWindow) return { success: false, error: 'No active window' };

    const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
      title: 'خروجی زیبا به PDF / Export Beautiful PDF',
      defaultPath: (defaultName?.replace(/\.[^/.]+$/, '') || 'document') + '.pdf',
      filters: [{ name: 'PDF Document (*.pdf)', extensions: ['pdf'] }],
    });

    if (canceled || !filePath) return { canceled: true };

    try {
      const data = await mainWindow.webContents.printToPDF({
        printBackground: true,
        pageSize: 'A4',
        margins: { top: 0.4, bottom: 0.4, left: 0.4, right: 0.4 },
      });

      await fs.writeFile(filePath, data);
      return { success: true, filePath };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  });

  // Export to HTML (Rendered preview only)
  ipcMain.handle('export:html', async (_event, { defaultName, htmlContent }: { defaultName?: string; htmlContent: string }) => {
    if (!mainWindow) return { success: false };

    const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
      title: 'خروجی زیبا به HTML مستقل / Export Beautiful HTML',
      defaultPath: (defaultName?.replace(/\.[^/.]+$/, '') || 'document') + '.html',
      filters: [{ name: 'HTML Document (*.html)', extensions: ['html'] }],
    });

    if (canceled || !filePath) return { canceled: true };

    try {
      await fs.writeFile(filePath, htmlContent, 'utf-8');
      return { success: true, filePath };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  });

  // Export to Word DOCX (Rendered preview only)
  ipcMain.handle('export:docx', async (_event, { defaultName, htmlContent, title }: { defaultName?: string; htmlContent: string; title?: string }) => {
    if (!mainWindow) return { success: false };

    const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
      title: 'خروجی به Microsoft Word (DOCX) / Export to Word Document',
      defaultPath: (defaultName?.replace(/\.[^/.]+$/, '') || 'document') + '.docx',
      filters: [{ name: 'Word Document (*.docx)', extensions: ['docx'] }],
    });

    if (canceled || !filePath) return { canceled: true };

    try {
      let docxBuffer = await HTMLtoDOCX(htmlContent, null, {
        title: title || 'MDGhashange Document',
        margins: {
          top: 1440,
          right: 1440,
          bottom: 1440,
          left: 1440,
          header: 720,
          footer: 720,
          gutter: 0,
        },
        font: 'Vazirmatn',
      });

      // Guard against html-to-docx undefined attributes in word/document.xml
      try {
        const zip = await JSZip.loadAsync(docxBuffer);
        let docXml = await zip.file('word/document.xml')?.async('string');
        if (docXml && docXml.includes('undefined')) {
          docXml = docXml.replace(/w:header="undefined"/g, 'w:header="720"')
                         .replace(/w:footer="undefined"/g, 'w:footer="720"')
                         .replace(/w:gutter="undefined"/g, 'w:gutter="0"');
          zip.file('word/document.xml', docXml);
          docxBuffer = await zip.generateAsync({ type: 'nodebuffer' });
        }
      } catch (zipErr) {
        console.warn('JSZip sanitizer warning:', zipErr);
      }

      await fs.writeFile(filePath, Buffer.from(docxBuffer));
      return { success: true, filePath };
    } catch (err: any) {
      console.error('Error generating DOCX:', err);
      return { success: false, error: err.message };
    }
  });

  // Window Controls
  ipcMain.on('window:minimize', () => mainWindow?.minimize());
  ipcMain.on('window:maximize', () => {
    if (mainWindow?.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow?.maximize();
    }
  });
  ipcMain.on('window:close', () => mainWindow?.close());
  ipcMain.handle('window:isMaximized', () => mainWindow?.isMaximized() ?? false);
}
