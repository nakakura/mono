var Mono = require('../dist/main').Main.Mono;
var _ = require('lodash');

function format(text){
  var args = text.match(/(".*?”|‘.*?'|'.*?'|".*?"|“.*?”|“.*?"|\S+)/g);
  return _.map(args, function(arg){
    return arg.replace(/'|“|‘|”|\"/g, "");
  });
}

module.exports = function (robot) {
  robot.respond(new RegExp("add.*", "i"), function (msg) {
    var user = msg.message.user.name;
    var args = format(msg.match[0].trim());

    if(args.length < 2) return;
    var command = args[1];
    var params = args.slice(2, args.length);
    console.log(command);
    console.log(params);
  });
};

console.log(new Mono());
console.log("mogemoge");
