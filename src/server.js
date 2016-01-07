"use strict";

/*
 * Node.js Server file to server this application
 * 
 * USE node Server.js to start this file
 * 
 * express module required. If this module not installed
 *  install using command 'npm install express'
 */


var express = require('express');
var bodyParser = require("body-parser");
var path = require('path');
var fs = require('fs');

var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

var app = express();

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// log for all request
app.use(function (req, res, next) {
    console.log(req.url);
    next();
});

app.post('/user', function (req, res) {
    //console.log(req.body);
    //console.log(req.body.username);

    var username = req.body.username;

    var sqlite3 = require('sqlite3').verbose();
    var db = new sqlite3.Database('doc.db');

    var response = {
        success: false
    };

    var users = [];
    db.serialize(function () {
        var stmt = db.prepare('SELECT * FROM users where user_name=?');

        stmt.each(username, function (err, row) {
            //console.log('Error', err);
            //console.log('Record', row);
            //console.log(row.id + ': ' + row.info);

            if (row) {
                //console.log('push record');
                users.push(row);
            }
            //console.log(users);
        }, function () {
            //console.log(users);
            if (users.length === 0) {
                response.error = {
                    msg: "Invalid username"
                };
                res.status(401);
            } else {
                response.success = true;
                response.data = users[0];
            }
            res.send(response);
            stmt.finalize();
        });
    });

    db.close();

    //console.log(users);

    //res.send(users);
});

app.set('superSecret', 'ilovescotchyscotch'); // secret variable

/* Login API before handle all request because this can be use without login  */
app.post('/api/login', function (req, res) {
    User.find(req.body.username, function (user) {
        if (!user || user.password !== req.body.password) {
            setTimeout(function () {
                res.status(404).json({success: false, error: 'Invalid username or password'});
            }, 2000);
        } else {
            // if user is found and password is right
            // create a token
            var token = jwt.sign({username: user.username}, app.get('superSecret'), {
                expiresIn: 1 * 60 * 60 * 24 // expires in 24 hours
            });

            setTimeout(function () {
                res.json({
                    success: true,
                    message: 'Login success',
                    token: token,
                    username: user.username,
                    first_name: user.first_name,
					last_name: user.last_name,
					email: user.email
                });
            }, 100);
        }
    });
});

// Handle all request
app.use(function (req, res, next) {
    if (req.url.indexOf('/api/') === 0) {
        next();
    } else {
        // send a file or 404 if not exist file
        sendFile(req, res);
    }
});

/** API **/

app.post('/api/savedoc', function (req, res) {
    var token = req.headers['x-access-token'];

    if (!token) {
        return res.status(401).json({success: false, error: 'Unautherize'});
    }

    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret'), function (err, decoded) {
        if (err) {
            return res.status(401).json({success: false, error: 'Unautherize'});
        } else {
            try {
                var user = new User();
                user.username = decoded.username;
                DocFile.save(req.body.path, req.body.content, user);
                res.status(200).send({success: true, message: 'success'});
            } catch (ex) {
                res.status(404).send({success: false, error: ex});
                return;
            }
            /*
            // if everything is good, save to request for use in other routes
            req.decoded = decoded;
            return res.status(200).send({
                success: true,
                message: 'token valid',
                decoded: decoded
            });
            */
        }
    });
});

// Handle server error (500)
app.use(function (err, req, res, next) {
    console.error(err.stack || err);
    res.status(500).send({status: 500, url: req.url, error: 'Internal server error'});
});

// Send file to client
function sendFile(req, res) {
    var str = req.url || '';

    if (str.indexOf('?') !== -1) {
        str = str.substring(0, str.indexOf('?'));
    }

    getFileName(str, function (fileName, noAccess) {
        if (noAccess) {
            res.status(404).send({status: 404, url: req.url});
        } else {
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
            } else {
                fileName = a.join("/");
                fs.stat(__dirname + '/' + fileName, function (err, stats) {

                    if (err || !stats.isFile())
                        noAccess = true;

                    callback(__dirname + '/' + fileName, noAccess);
                });
            }
        });
    }

}

/** File save **/
var DocFile = {
    save: function (fileName, content, user) {
        // if filename not valid then throw msg
        // if empty content then throw msg
        // if username && password required and not passed then throw msg

        if (!fileName)
            throw 'Invalid fileName';

        if (!content)
            throw 'Empty content';

        if (!user)
            throw 'Login required';

        if (!user.username && (!user.git_username && !user.get_password))
            throw 'User invalid';

        if (!user.git_username && !user.get_password) {
            user = User.find(user.username, function () {
                DocFile._save(fileName, content, user);
            });
        } else {
            DocFile._save();
        }
    },
    _save: function (fileName, content, user) {
        console.log('File saved ' + fileName);
    }
};

var User = function () {
    this.userid = 0;
    this.username = '';
    this.email = '';
    this.first_name = '';
    this.last_name = '';
    this.password = '';
    this.git_username = '';
    this.git_password = '';
};

User.find = function (username, callback) {
    var sqlite3 = require('sqlite3').verbose();
    var db = new sqlite3.Database('doc.db');

    var users = [];
    db.serialize(function () {
        var stmt = db.prepare('SELECT * FROM users where user_name=?');

        stmt.each(username, function (err, row) {
            if (row) {
                users.push(row);
            }
        }, function () {
            var user;
            if (users.length !== 0) {
                user = new User();
                user.userid = users[0].user_id;
                user.username = users[0].user_name;
                user.password = users[0].password;
                user.email = users[0].email;
                user.first_name = users[0].first_name;
                user.last_name = users[0].last_name;
                user.git_username = users[0].git_username;
                user.git_password = users[0].git_password;
            }
            stmt.finalize();
            callback && callback(user); // jshint ignore:line
        });
    });

    db.close();
};

app.listen(3000);
console.log('Listening on port 3000...');