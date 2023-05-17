'use strict';

var electron = require('electron');
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;
var mainWindow = null;
const { Menu } = require('electron')

const template = [
  {
    label: 'Menu',
    submenu: [
      {
        label: 'Exit',
        accelerator: 'Ctrl+W',
        click: () => { app.quit() }
      },
      { type: 'separator' },
      {
        label: 'Reload',
        accelerator: 'Ctrl+R',
        click: () => { mainWindow.webContents.reload() }
      }
    ]
  }
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

app.on('ready', function () {
    mainWindow = new BrowserWindow({ 
        width: 800, 
        height: 600,
        kiosk: true
    });
    mainWindow.loadURL('file://' + __dirname + '/index.html');
    mainWindow.on('closed', function () { mainWindow = null; });
});

