var fs = require('fs'),
    ejs = require('ejs'),
    color = require('./ShareVariables').color,
    musicBoxDir = __dirname + "/webapp/html/MusicBox.ejs",
    musicBoxHiddenDir = __dirname + "/webapp/html/MusicBoxHidden.ejs",
    mBoxCtlDir = __dirname + "/webapp/html/MusicBoxController.ejs",
    midiDir = __dirname + "/webapp/midi";

var Page = function () {};

Page.prototype = {
    getMusicBoxPage : function (req, res, space, speakerNum) {
        readAllSongInDir(midiDir, function (err) {
            if (err)
                console.log(err);
            else {
                fs.readFile(musicBoxDir,
                    function (err, contents) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            contents = contents.toString('utf8');
                            res.writeHead(200, {"Content-Type": "text/html"});
                            var columnNum = 3;
                            var tr = [];
                            var colorIndex = 0;
                            for (var i = 0; i < Math.ceil(speakerNum / columnNum); i++) {
                                var td = [];
                                for (var j = 0; j < columnNum; j++) {
                                    if (colorIndex < speakerNum)
                                        td.push(color[colorIndex++]);
                                }
                                tr.push(td);
                            }
                            // console.log({tr:tr,space:space});
                            res.end(ejs.render(contents, {tr: tr, space: space}));
                        }
                    }
                );
            }

        });
    },
    getMusicBoxHiddenPage: function (req, res, space, speakerNum) {
        readAllSongInDir(midiDir, function (err) {
            if (err)
                console.log(err);
            else {
                fs.readFile(musicBoxHiddenDir,
                    function (err, contents) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            contents = contents.toString('utf8');
                            res.writeHead(200, {"Content-Type": "text/html"});
                            var columnNum = 3;
                            var tr = [];
                            var colorIndex = 0;
                            for (var i = 0; i < Math.ceil(speakerNum / columnNum); i++) {
                                var td = [];
                                for (var j = 0; j < columnNum; j++) {
                                    if (colorIndex < speakerNum)
                                        td.push(color[colorIndex++]);
                                }
                                tr.push(td);
                            }
                            // console.log({tr:tr,space:space});
                            res.end(ejs.render(contents, {tr: tr, space: space}));
                        }
                    }
                );
            }

        });
    },
    getMBoxCtlPage : function (req, res, iottalkIP,IDFList) {

        readAllSongInDir(midiDir, function (err, songs) {
            if (err)
                console.log(err);
            else {
                fs.readFile(mBoxCtlDir,
                    function (err, contents) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            contents = contents.toString('utf8');
                            res.writeHead(200, {"Content-Type": "text/html"});
                            res.end(ejs.render(contents, {
                                songs: songs,
                                iottalkIP: iottalkIP,
                                IDFList:IDFList
                            }));
                        }
                    }
                );
            }

        });
    }

};


var readAllSongInDir = function (midiDir, callback) {
    fs.readdir(midiDir, function (err, files) {
        if (err) {
            callback(err);
            return;
        }
        else {
            var songs = [];
            for (var i = 0; i < files.length; i++) {
                var l = files[i].length;
                if (files[i].slice(l - 3, l).toLowerCase() == "mid")
                    songs.push(files[i].slice(0, l - 4));
            }
            callback(null, songs);
        }
    });
};


exports.Page = new Page();