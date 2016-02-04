'use strict'

var ipc = require('electron').ipcRenderer;
var polling_interval = 30 * 1000; //30 seconds
var reminder_interval = 60 * 60 * 1000; //1 Hour
var Github = require('./github');
var github = new Github();
var date = new Date().toISOString();

var notificationsCallback = function(data){
  console.log(date);
  console.log(data.length);
  if (data.length == 0)
    return;

  let message;
  if (data.length == 1) {
    try {
      message = data[0].subject.title
    } catch(e){
      message = "You have " + data.length + " unread Github notifications";
    }
  } else {
    message = "You have " + data.length + " unread Github notifications";
  }

  new Notification('New Github Notification', {
    body: message
  })
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
  github.notifications(new Date().toISOString())
  .then(notificationsCallback)
  .catch( function(err) {
    console.log(err);
  })
}

var interval = setInterval(checkForNotifications, polling_interval);
var reminder = setInterval(remindAboutNotifications, reminder_interval );

ipc.on('reset', function() {
  clearInterval(interval);
  clearInterval(reminder);
  interval = setInterval(notify, interval);
  reminder = setInterval(remindAboutNotifications, reminder_interval)
})
