'use strict'
const https   = require('https');
const fs      = require('fs');
const Promise = require('bluebird');
const path    = require('path');
const helper = require('./helper');
const credentialsFile = path.join(helper.getRoot(), 'credentials.json');
const request = require('superagent');
const githubUrl = 'https://api.github.com/notifications'
module.exports = class Github {

  getCredentialsFile() {
    return credentialsFile;
  }
  getCredentials(){
    return new Promise( (resolve, reject) => {
      fs.readFile( credentialsFile, (err, data) => {
        try {
          let res = JSON.parse(data);
          resolve(res);
          reject(err);
        } catch( e ) {
          reject(err);
        }
      });
    })
  }

  setCredentials(username, token) {
    return new Promise((resolve, reject) => {
      var data = JSON.stringify({username: username, token: token});
      fs.writeFile(credentialsFile, data, (err) => {
        if(err)
          return reject(err);
        else
          return resolve();
      });
    })
  }
  validateToken( username, token ) {
    return new Promise( (resolve, reject) => {
      request.get( githubUrl )
      .set({ "Authorization": "TOKEN " +token, "User-Agent": username })
      .end( (err, res) => {
        if (err)
          return resolve(res.statusCode == 200);
        else
          return reject(err);
      })
    })
  }
  notifications( since ){
    return new Promise( (resolve, reject) => {
      let token, username;
      this.getCredentials()
      .then( (creds) => {
        token = "TOKEN " + creds.token;
        username = creds.username;
      })
      .then( () => {

        request.get( githubUrl )
        .query({since: since})
        .set({ "Authorization": token, "User-Agent": username })
        .end( (err, res) => {
          if (!err)
            return resolve(res.body);
          else
            return reject(err);
        })
      })
      .catch( ( err ) => {
        return reject(err);
      })
    })
  }
}
