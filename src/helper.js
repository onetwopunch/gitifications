'use strict'

module.exports = {
  getRoot: function(){
    var spl = __dirname.split("/");
    spl.pop();
    return spl.join("/");
  }
}
