'use strict';

const electron = require('electron');
const app = electron.app;
const Menu = electron.Menu;
const MenuItem = electron.MenuItem;
const Notification = electron.Notification;
const BrowserWindow = electron.BrowserWindow;
const Tray = electron.Tray;

const helper = require('./src/helper');
const Github = require('./src/github');
const Messenger = require('./src/messenger');
const path = require('path');
const fs = require('fs');

let tray, quit, messenger, window, gh;

var open_login_window = function() {
  window = new BrowserWindow({ width: 500, height: 500, show: false })
  window.on('closed', () => { window = null } )

  let url = path.join("file://", helper.getRoot(), 'views', 'login.html');
  window.loadURL(url);
  window.show();
  // window.webContents.openDevTools();
}
app.on('ready', function() {

  tray = new Tray( path.join(__dirname, 'img', 'git.png') );
  let contextMenu = Menu.buildFromTemplate([
    { label: 'Set Token', click: open_login_window},
    { label: 'Quit', click: app.quit }
  ]);

  // TODO: if user hasnt set token and user name, open a window to have them do that.
  tray.setToolTip('This is my application.');
  tray.setContextMenu(contextMenu);

  //Set up messenger
  messenger = new Messenger();

  // Hide the dock
  app.dock.hide()

  gh = new Github()
  fs.stat(gh.getCredentialsFile(), function(err, stats) {
    if (!stats) {
      open_login_window()
    }
  })
})
