'use strict'

const ipc = require('electron').ipcRenderer;
const polling_interval = 30 * 1000; //30 seconds
const reminder_interval = 60 * 60 * 1000; //1 Hour
const Github = require('./github');
const github = new Github();
const date = new Date().toISOString();
const NotificationCenter = require('node-notifier').NotificationCenter;
const helper = require('./helper');
const path = require('path');
const remote = require('electron').remote;
const BrowserWindow = remote.BrowserWindow;

var notificationsCallback = function(data){
  console.log(date);
  console.log(data.length);
  if (data.length == 0)
    return;

  let message, type;
  if (data.length == 1) {
    try {
      message = data[0].subject.title
      type = data[0].subject.type
    } catch(e){
      message = "You have " + data.length + " unread Github notifications";
      type  = "Reminder"
    }
  } else {
    message = "You have " + data.length + " unread Github notifications";
    type  = "Reminder"
  }

  // new Notification('New Github Notification', {
  //   body: message
  // })
  var notifier = new NotificationCenter();
  var icon = path.join(helper.getRoot(), 'img', 'git_icon.png');
  notifier.notify({
    'title': "New Github Notification",
    'subtitle': type,
    'message': message,
    'sound': 'Funk', // Case Sensitive string for location of sound file, or use one of OS X's native sounds (see below)
    'icon': icon, // Absolute Path to Triggering Icon
    'wait': true // Wait for User Action against Notification
  });
  date = new Date().toISOString();
}

function checkForNotifications() {
  console.log("Poller");
  github.notifications(date)
  .then(notificationsCallback)
  .catch( function(err) {
    console.log(err);
  })
}

function remindAboutNotifications() {
  console.log("Reminder!")
  github.notifications()
  .then(notificationsCallback)
  .catch( function(err) {
    console.log(err);
  })
}

remindAboutNotifications()

var interval = setInterval(checkForNotifications, polling_interval);
var reminder = setInterval(remindAboutNotifications, reminder_interval );

ipc.on('reset', function() {
  clearInterval(interval);
  clearInterval(reminder);
  remindAboutNotifications()
  interval = setInterval(notify, interval);
  reminder = setInterval(remindAboutNotifications, reminder_interval)
})
