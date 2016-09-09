var _ = require('lodash');
var Mono = require('../dist/main').Main.Mono;
var mono = new Mono();

function format(text){
  var args = text.match(/(".*?”|‘.*?'|'.*?'|".*?"|“.*?”|“.*?"|\S+)/g);
  return _.map(args, function(arg){
    return arg.replace(/'|“|‘|”|\"/g, "");
  });
}

module.exports = function (robot) {
  robot.respond(new RegExp(".*", "i"), function (msg) {
    var user = msg.message.user.name;
    var args = format(msg.match[0].trim());
    console.log(args);
    var params = args.slice(1, args.length);
    console.log(params);
    mono.exec(user, params, msg);
  });
};

