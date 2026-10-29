import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export interface FileNode {
  name: string;
  path: string;
  isDirectory: boolean;
  children?: FileNode[];
}

export interface ElectronAPI {
  openFile: () => Promise<{ filePath?: string; fileName?: string; content?: string; error?: string } | null>;
  openFolder: () => Promise<{ folderPath?: string; folderName?: string; tree?: FileNode[]; error?: string } | null>;
  readFile: (filePath: string) => Promise<{ content?: string; fileName?: string; error?: string }>;
  writeFile: (filePath: string, content: string) => Promise<{ success: boolean; error?: string }>;
  saveFileAs: (defaultName?: string, content?: string) => Promise<{ filePath?: string; fileName?: string; success?: boolean; error?: string } | null>;
  exportPdf: (defaultName?: string) => Promise<{ success?: boolean; filePath?: string; canceled?: boolean; error?: string }>;
  exportHtml: (defaultName: string, htmlContent: string) => Promise<{ success?: boolean; filePath?: string; canceled?: boolean; error?: string }>;
  exportDocx: (defaultName: string, htmlContent: string, title?: string) => Promise<{ success?: boolean; filePath?: string; canceled?: boolean; error?: string }>;
  getInitialFile: () => Promise<{ filePath?: string; fileName?: string; content?: string } | null>;
  onOpenFileFromCli: (callback: (fileData: { filePath: string; fileName: string; content: string }) => void) => () => void;
  minimizeWindow: () => void;
  maximizeWindow: () => void;
  closeWindow: () => void;
  isMaximized: () => Promise<boolean>;
  onOpenHelp: (callback: () => void) => () => void;
}

const api: ElectronAPI = {
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  openFolder: () => ipcRenderer.invoke('dialog:openFolder'),
  readFile: (filePath: string) => ipcRenderer.invoke('fs:readFile', filePath),
  writeFile: (filePath: string, content: string) => ipcRenderer.invoke('fs:writeFile', { filePath, content }),
  saveFileAs: (defaultName?: string, content?: string) => ipcRenderer.invoke('dialog:saveFileAs', { defaultName, content: content || '' }),
  exportPdf: (defaultName?: string) => ipcRenderer.invoke('export:pdf', defaultName),
  exportHtml: (defaultName: string, htmlContent: string) => ipcRenderer.invoke('export:html', { defaultName, htmlContent }),
  exportDocx: (defaultName: string, htmlContent: string, title?: string) => ipcRenderer.invoke('export:docx', { defaultName, htmlContent, title }),
  getInitialFile: () => ipcRenderer.invoke('app:getInitialFile'),
  onOpenFileFromCli: (callback) => {
    const handler = (_event: IpcRendererEvent, data: any) => callback(data);
    ipcRenderer.on('app:openFileFromCli', handler);
    return () => {
      ipcRenderer.removeListener('app:openFileFromCli', handler);
    };
  },
  minimizeWindow: () => ipcRenderer.send('window:minimize'),
  maximizeWindow: () => ipcRenderer.send('window:maximize'),
  closeWindow: () => ipcRenderer.send('window:close'),
  isMaximized: () => ipcRenderer.invoke('window:isMaximized'),
  onOpenHelp: (callback) => {
    const handler = () => callback();
    ipcRenderer.on('menu:openHelp', handler);
    return () => {
      ipcRenderer.removeListener('menu:openHelp', handler);
    };
  },
};

contextBridge.exposeInMainWorld('electronAPI', api);
