/* The only bridge between the page and the shell: window controls. Nothing else is exposed. */
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('riamp3Desktop', {
  isDesktop: true,
  minimize: () => ipcRenderer.send('window:minimize'),
  toggleMaximize: () => ipcRenderer.send('window:toggle-maximize'),
  close: () => ipcRenderer.send('window:close'),
  onWindowState: (cb) => {
    ipcRenderer.on('window:state', (_e, s) => cb(s));
  }
});
