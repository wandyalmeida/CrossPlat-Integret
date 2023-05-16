'use strict';

var electron = require('electron');
var app = electron.app;
// var sqlite3 = require('sqlite3').verbose();
// var db = new sqlite3.Database('musics.db');

// db.run("CREATE TABLE waitList (ID_song INTEGER, title TEXT, artist TEXT, userName TEXT)");

// db.close();

var BrowserWindow = electron.BrowserWindow;
var mainWindow = null;
app.disableHardwareAcceleration();

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

app.on('ready', function () {
    mainWindow = new BrowserWindow({ width: 650, height: 510 });
    mainWindow.loadURL('file://' + __dirname + '/index.html');
    mainWindow.on('closed', function () { mainWindow = null; });
});

