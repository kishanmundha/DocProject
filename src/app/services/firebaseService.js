(function () {
    'use strict';

    var app = angular.module('app');

    app.service('firebaseService', ['$log', '$q', '$cacheFactory', function ($log, $q, $cacheFactory) {

        var _projectInitPromise;

        var database = firebase.database();

        var cache = $cacheFactory('firebaseCache');

        initProject();

        function initProject() {

            if (_projectInitPromise) {
                return _projectInitPromise;
            }

            var defer = $q.defer();

            _projectInitPromise = defer.promise;

            $log.debug('Initializing project');

            var db = database.ref('projects');

            db.once('value').then(function (p) {
                var projects = p.val();

                projects.forEach(function (project) {
                    var p = Project.add(project.projectId, project.projectName);
                    if (project.categories) {
                        project.categories.forEach(function (category) {
                            p.addCategory(category.name, category.display);
                        });
                    }
                    project.docs.forEach(function (doc) {
                        p.addDoc(doc.docId, doc.docName, doc.category || '', doc.options);
                    });
                });

                defer.resolve();
            });

            database.ref('settings').once('value').then(function (s) {
                var val = s.val();
                if (val && val.nonWords) {
                    Project.addNonWords(val.nonWords);
                }
            });

            return defer.promise;
        }

        function getDocContent(path) {
            var defer = $q.defer();

            var firebasePath = 'docFiles/' + path;

            var _cache = cache.get(firebasePath);

            if (_cache) {
                defer.resolve(_cache);
            } else {
                var db = database.ref(firebasePath);

                db.once('value').then(function (d) {
                    var dObj = d.val();

                    if (dObj === null) {
                        defer.reject();
                    } else {
                        cache.put(firebasePath, dObj);
                        defer.resolve(dObj);
                    }
                });
            }

            return defer.promise;
        }

        function saveDocContent(path, content) {
            var defer = $q.defer();

            if (!content) {
                defer.reject('Content required');
                return defer.promise;
            }

            getDocContent(path).then(function (data) {
                database.ref('backup').push({
                    path: path,
                    timestamp: (new Date()).toString(),
                    data: data
                });

                var firebasePath = 'docFiles/' + path;

                cache.remove(firebasePath);

                database.ref(firebasePath).set({
                    lastModified: (new Date()).toString(),
                    data: content
                }).then(function () {
                    defer.resolve();
                }, function (err) {
                    defer.reject();
                });

            });

            return defer.promise;
        }

        function firebaseLogin(method) {
            var defer = $q.defer();

            var provider;

            switch (method) {
                case 'google':
                    provider = new firebase.auth.GoogleAuthProvider();
                    break;
            }

            if (!provider) {
                defer.reject('Unknown provider');
            } else {
                firebase.auth().signInWithPopup(provider).then(function (result) {
                    $log.debug('Firebase login success');
                    // This gives you a Google Access Token. You can use it to access the Google API.
                    var token = result.credential.accessToken;
                    // The signed-in user info.
                    var user = result.user;

                    defer.resolve(user);
                }).catch(function (error) {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    // The email of the user's account used.
                    var email = error.email;
                    // The firebase.auth.AuthCredential type that was used.
                    var credential = error.credential;
                    // ...

                    $log.log('Login error -> errorMessage => ', errorMessage);

                });
            }

            return defer.promise;
        }

        function logOut() {
            firebase.auth().signOut().then(function () {
                // Sign-out successful.
            }, function (error) {
                // An error happened.
            });
        }

        function addDocument(data) {
            var defer = $q.defer();

            var obj = {
                docId: data.docId,
                docName: data.docName,
                category: data.category || '',
                options: {
                    tags: data.tags || '',
                    fileName: data.fileName || '',
                    noDoc: data.noDoc || false,
                    noList: data.noList || false
                }
            };

            database.ref('projects/' + data.projectIndex + '/docs/' + data.docIndex).set(obj).then(function () {
                database.ref('docFiles/' + data.projectId + '/' + data.docId).set({
                    lastModified: (new Date()).toString(),
                    data: 'Empty content'
                }).then(function () {
                    defer.resolve();
                }, function (err) {
                    defer.reject(err);
                });
            }, function (err) {
                defer.reject(err);
            });

            return defer.promise;
        }

        return {
            initProject: initProject,
            getDocContent: getDocContent,
            saveDocContent: saveDocContent,
            firebaseLogin: firebaseLogin,
            logOut: logOut,
            addDocument: addDocument
        };
    }]);

})();