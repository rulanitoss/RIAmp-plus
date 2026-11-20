/* RIAMP3 — desktop shell.
   Starts the local server in this process (so the YouTube API key never reaches the renderer),
   then opens a frameless window that draws its own Windows title bar. */

const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const fs = require('node:fs');
const { pathToFileURL } = require('node:url');

// Let the YouTube IFrame player start audio on the first user-initiated play without
// flunking Chrome's autoplay policy (the API callback fires outside the click gesture).
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');

let win = null;
let server = null;

async function startLocalServer() {
  const dataDir = app.getPath('userData');
  fs.mkdirSync(dataDir, { recursive: true });
  const configPath = path.join(dataDir, 'supabase.config.json');
  if (!fs.existsSync(configPath)) {
    const configuredTemplate = path.join(__dirname, 'supabase.config.json');
    const exampleTemplate = path.join(__dirname, 'supabase.config.json.example');
    if (fs.existsSync(configuredTemplate)) fs.copyFileSync(configuredTemplate, configPath);
    else if (fs.existsSync(exampleTemplate)) fs.copyFileSync(exampleTemplate, configPath);
    else fs.writeFileSync(configPath, JSON.stringify({ url: '', anonKey: '' }, null, 2));
  }
  process.env.RIAMP3_CONFIG_PATH = configPath;
  const mod = await import(pathToFileURL(path.join(__dirname, 'lib', 'server.mjs')).href);
  return mod.startServer(0);
}

function makeWindow(load) {
  win = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 900,
    minHeight: 620,
    frame: false,
    roundedCorners: true,
    show: false,
    backgroundColor: '#08080a',
    title: 'RIAMP3',
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      spellcheck: false
    }
  });

  load(win);
  win.once('ready-to-show', () => win.show());
  win.on('maximize', () => win.webContents.send('window:state', { maximized: true }));
  win.on('unmaximize', () => win.webContents.send('window:state', { maximized: false }));
  win.on('closed', () => { win = null; });
  return win;
}

ipcMain.on('window:minimize', () => { if (win) win.minimize(); });
ipcMain.on('window:toggle-maximize', () => {
  if (!win) return;
  if (win.isMaximized()) win.unmaximize(); else win.maximize();
});
ipcMain.on('window:close', () => { if (win) win.close(); });

app.setName('RIAMP3');
app.setAppUserModelId('com.riamp3.desktop');

app.whenReady().then(async () => {
  try {
    const started = await startLocalServer();
    server = started.server;
    makeWindow((w) => w.loadURL('http://127.0.0.1:' + started.port + '/'));
  } catch (err) {
    // If the server cannot start, the interface still opens from disk with its demo catalogue.
    makeWindow((w) => w.loadFile(path.join(__dirname, 'public', 'index.html')));
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    if (server) makeWindow((w) => w.loadURL('http://127.0.0.1:' + server.address().port + '/'));
    else makeWindow((w) => w.loadFile(path.join(__dirname, 'public', 'index.html')));
  }
});

app.on('window-all-closed', () => {
  if (server) { try { server.close(); } catch {} }
  app.quit();
});
