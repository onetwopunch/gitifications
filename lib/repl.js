var repl = require("repl");


var cnsl = repl.start({
  prompt: "[ gitify ] =>> "
})

cnsl.context.Github = require('./github');
