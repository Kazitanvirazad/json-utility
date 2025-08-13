import { contextBridge, ipcRenderer } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';

// Custom APIs for renderer
const api = {};

// Use 'contextBridge' APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI);
    contextBridge.exposeInMainWorld('api', api);
    contextBridge.exposeInMainWorld('uiHandlers', {
      isValidJson: (value) => ipcRenderer.invoke('isValidJson', value),
      prettifyJson: (value, indent) => ipcRenderer.invoke('prettifyJson', value, indent),
      minifyJson: (value) => ipcRenderer.invoke('minifyJson', value),
      copyToClipboard: (value) => ipcRenderer.invoke('copyToClipboard', value),
      convertToXmlFromJson: (value) => ipcRenderer.invoke('convertToXmlFromJson', value),
      convertToJsonFromXml: (value) => ipcRenderer.invoke('convertToJsonFromXml', value)
    });
  } catch (error) {
    console.error(error);
  }
} else {
  window.electron = electronAPI;
  window.api = api;
}
