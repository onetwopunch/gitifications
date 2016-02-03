var repl = require("repl");

var envName = process.env.NODE_ENV || "dev";
require('dotenv').config();

var cnsl = repl.start({
  prompt: "["+envName+"]=>> "
})

cnsl.context.Github = require('./github');
