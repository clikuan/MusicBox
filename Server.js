var express = require("express"),
    app = express(),
    server = require("http").createServer(app),
    pageGen = require("./PageGen"),
    servio = require("socket.io")(server),
    MidiConvert = require("./MidiConvert"),
    dan = require("./DAN").dan,
    msgHandler = require("./MessageHandler").msgHandler,
    mboxctlHandler = require("./MBoxCtlHandler").mboxctlHandler,
    ODFList = require("./ShareVariables").ODFList,
    IDFList = require("./ShareVariables").IDFList;

var iottalkIP = process.argv[2];

console.log(iottalkIP);

app.use(express.static("./webapp"));

app.get("/", function (req, res) {
    pageGen.Page.getMusicBoxPage(req,res,msgHandler.getC());
});

app.get("/mboxctl|smboxctl", function (req, res) {
    pageGen.Page.getMBoxCtlPage(req,res,iottalkIP,IDFList,
        msgHandler.getCtlDefaultValues());
});


msgHandler.setSocketIo(servio);
mboxctlHandler.setSocketIo(servio);

server.listen((process.env.PORT || 5566), '0.0.0.0');

var genMacAddr = function () {
    var addr = '';
    for (var i = 0; i < 5; i++)
        addr += '0123456789abcdef'[Math.floor(Math.random() * 16)];
    return addr;
};
var macAddr = genMacAddr();
console.log('mac address:' + macAddr);
dan.init(msgHandler.pull, 'http://' + iottalkIP , macAddr, {

    'dm_name': 'MusicBox',
    'u_name': 'yb',
    'is_sim': false,
    'df_list':ODFList

}, function (result) {
    console.log('register:', result);

    //deregister when app is closing
    process.on('exit', dan.deregister);
    //catches ctrl+c event
    process.on('SIGINT', dan.deregister);
    //catches uncaught exceptions
    process.on('uncaughtException', dan.deregister);

});









