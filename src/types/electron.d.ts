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
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}
