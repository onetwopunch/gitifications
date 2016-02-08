const Github = require('../src/github');
const gh = new Github();
const save = document.getElementById('save');
const paste = document.getElementById('paste');
const win = require('electron').remote.getCurrentWindow();
const dialog = require('electron').dialog;
const clipboard = require('electron').clipboard;

save.onclick = function(){
  var username = document.getElementById('username').value;
  var token = document.getElementById('token').value;
  console.log(username);
  console.log(token);
  gh.validateToken(username, token)
  .then( function(result){
    if (result) {
      console.log("result true");
      return gh.setCredentials(username, token)
    } else {
      console.log("result false");
      throw new Error("The username or token you entered was incorrect")
    }
  })
  .then( function(){
    console.log('Saved');
    swal({
      title: "Saved!",
      text: "Username and token saved, you can reset them in the tray menu. You'll now be notified any time you get a Github notification!",
      confirmButtonText: "Cool story bro",
      closeOnConfirm: true
    }, function(){ win.close(); })

  }).catch(function(err){
    console.log("error caught " + err);
    swal({
      title: "Error!",
      text: err,
      type: "error",
      confirmButtonText: "Good to know" });
  })
};
paste.onclick = function() {
  document.getElementById('token').value = clipboard.readText();
}
gh.getCredentials()
.then( function(data){
  document.getElementById('username').value = data.username;
  document.getElementById('token').value = data.token;
})
.catch(() => {console.log("No credentials file") });
