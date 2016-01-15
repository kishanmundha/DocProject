"use strict";

/*
 * Node.js Server file to server this application
 * 
 * USE node Server.js to start this file
 * 
 * express module required. If this module not installed
 *  install using command 'npm install express'
 */

var config = {
    saveDocEnabled: false, // save file
    gitLocalSave: false, // commit on git
    gitRemoteSave: false, // commit on remote
    gitCredtianal: undefined, // from request, from db, from default
    gitDefaultCredtinal: {
        username: undefined,
        password: undefined
    }
};

var express = require('express');
var bodyParser = require("body-parser");
var path = require('path');
var fs = require('fs');

var app = express();

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// log for all request
app.use(function (req, res, next) {
    console.log(req.url);
    next();
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
    if (!config.saveDocEnabled) {
        return res.status(404).json({success: false, error: 'Document save service disabled on server'});
    }
	
	if(config.gitRemoteSave) {
		// get remote creditnal
	}
	
	var fName = DocFile.getFullFilePath(req.body.path || '');
	var fContent = (req.body.content || '').trim();
	
	if(!fName) {
		return res.status(403).json({success: false, error: 'No file to modify'});
	}
	
	// is valid file
	// is file exists
	// is content modified
	
	// replace content
	
	DocFile.getFileContent(fName, function(err, content) {
		if(err) {
			var status = err.status;
			var msg = err.msg;
			return res.status(status).json({success: false, error: msg});
		}
		else if(fContent === content) {
			return res.status(400).json({success: false, error: 'Content not modified'});
		}
		else {
			DocFile.save(fName, fContent, function(err) {
				if(err) {
					return res.status(500).json({success: false, error: err});
				}
				else {
					if(!config.gitEnabled) {
						return res.json({success: true, message: 'Content saved'});
					}
					else {
						DocFile.gitCommit(fName, 'data updated', function(err) {
							if(err) {
								return res.status(206).json({success: true, message: 'File saved, Error in commit on Git (' + err + ')'});
							}
							else {
								if(!config.gitRemoteEnabled) {
									return res.json({success: true, message: 'Content saved'});
								}
								else {
									return res.json({success: true, message: 'Content saved! (Remote plugin not available)'});
								}
							}
						});
					}
				}
			});
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
	getFullFilePath: function(fileName) {
		
		if(fileName.indexOf('/') !== 0)
			fileName = '/' + fileName;
		
		if(fileName.indexOf('/data/docs/') !== 0)
			return undefined;
		
		fileName = fileName.replace(/\//g, '\\');
		return __dirname + fileName;
	},
	getFileContent: function(fileName, callback) {
		
		var error = {status: 500, msg: 'test'}
		var content = undefined;
		
		fs.readFile(fileName, 'utf8', function (err,data) {
			if (err) {
				error.msg = err;
				callback(error, undefined);
			}
			else {
				callback(undefined, data);
			}
		});
	},
    save: function (fileName, content, callback) {
        // if filename not valid then throw msg
        // if empty content then throw msg
        // if username && password required and not passed then throw msg
				
		fs.writeFile(fileName, content, function(err) {
			if(err) {
				callback(err);
			}
			else {
				callback();
			}
		});
		
		return;

        if (!user)
            throw 'Login required';

        if (!user.username && (!user.git_username && !user.get_password))
            throw 'User invalid';

        if (!user.git_username && !user.get_password) {
            user = User.find(user.username, function () {
                DocFile._save(fileName, content, user, callback);
            });
        } else {
            DocFile._save(fileName, content, user, callback);
        }
    },
    _save: function (fileName, content, user, callback) {
        console.log('File saved ' + fileName);
        
        callback && callback();
    },
    commit: function (fileName, comment, callback) {
        callback && callback();
    },
    syncCommit: function (fileName, username, password, callback) {
        callback && callback();
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