var Mono = require('../dist/main').Main.Mono;

module.exports = function (robot) {
  robot.respond(new RegExp("add.*", "i"), function (msg) {
    var user = msg.message.user.name;
    var args = msg.match[0];
    console.log(user);
    console.log(args);
  });
};

console.log(new Mono());
console.log("mogemoge");
