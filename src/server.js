/*
 * Node.js Server file to server this application
 * 
 * USE node Server.js to start this file
 * 
 * express module required. If this module not installed
 *  install using command 'npm install express'
 */


var express = require('express');
var path = require('path');
var fs = require('fs');

var app = express();

// Handle all request
app.use(function (req, res, next) {
    // send a file or 404 if not exist file
    sendFile(req, res);
});

// Handle server error (500)
app.use(function (err, req, res, next) {
    console.error(err.stack || err);
    res.status(500).send({status: 500, url: req.url, error: err.stack || err});
});

// Send file to client
function sendFile(req, res) {
    var str = req.url || '';
    
    if(str.indexOf('?') !== -1) {
    	str = str.substring(0, str.indexOf('?'));
    }

    getFileName(str, function (fileName, noAccess) {
        if (noAccess) {
            res.status(404).send({status: 404, url: req.url});
        }
        else {
            res.sendFile(fileName);
        }
    });
}

function getFileName(url, callback) {
    var fileName = '';

    var a = (url).split('/');

    a = a.filter(function (item) {
        return item;
    });

    if (a.length === 0) {
        fileName = 'index.html';
        callback(__dirname + '/' + fileName);
    } else {
        fs.stat(__dirname + '/' + a[0], function (err, stats) {
            //console.log(err, stats);

            var noAccess = false;
            if (err) {
                fileName = 'index.html';
                callback(__dirname + '/' + fileName);
            }
            else {
                fileName = a.join("/");
                fs.stat(__dirname + '/' + fileName, function (err, stats) {
                    var noAccess = false;

                    if (err || !stats.isFile())
                        var noAccess = true;

                    callback(__dirname + '/' + fileName, noAccess);
                });
            }
        });
    }

}

app.listen(3000);
console.log('Listening on port 3000...');