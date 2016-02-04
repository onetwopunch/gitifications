'use strict';

const electron = require('electron');
const nativeImage = require('electron').nativeImage;
const app = electron.app;
const Menu = electron.Menu;
const MenuItem = electron.MenuItem;
const Notification = electron.Notification;
const Messenger = require('./lib/messenger');
const Tray = electron.Tray;
const path = require('path');

let tray, quit, messenger;

var open_token_window = function() {}
app.on('ready', function() {

  let image = nativeImage.createFromPath(path.join(__dirname, 'img', 'github.png'))
  tray = new Tray( image );
  let contextMenu = Menu.buildFromTemplate([
    { label: 'Add token', click: open_token_window},
    { label: 'Quit', click: app.quit }
  ]);

  // TODO: if user hasnt set token and user name, open a window to have them do that.
  tray.setToolTip('This is my application.');
  tray.setContextMenu(contextMenu);

  //Set up messenger
  messenger = new Messenger();

  // Hide the dock
  app.dock.hide()
})
