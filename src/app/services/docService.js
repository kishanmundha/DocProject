/* global Project, data */

(function () {
    'use strict';

    var app = angular.module('app');

    app.service('docService', ['$log', '$http', '$rootScope', 'messageModalService', 'config', '$q', '$timeout', 'localStorageService',
        function ($log, $http, $rootScope, messageModalService, config, $q, $timeout, localStorageService) {

            var _allDocs;

            /**
             * @public
             * @description Get list of project
             * @returns {Array} List of project
             */
            var getProjectList = function () {
                return data.map(function (item) {
                    return {
                        'projectId': item.projectId,
                        'projectName': item.projectName
                    };
                });
            };

            /**
             * @public
             * @description Get project object
             * @param {String} projectId
             * @returns {Object} Project Object
             */
            var getProject = function (projectId) {
                var p = data.filter(function (item) {
                    return item.projectId === projectId;
                })[0];

                // project not exist
                if (!p)
                    return;

                // make a project object
                var project = {
                    'projectId': p.projectId,
                    'projectName': p.projectName,
                    'fileName': p.fileName,
                    'categories': p.categories
                };

                project.docs = p.docs.map(function (item) {
                    return {
                        'docId': item.docId,
                        'docName': item.docName,
                        'fileName': item.fileName,
                        'tags': item.tags,
                        'category': item.category || '',
                        'noDoc': item.noDoc || false,
                        'noList': item.noList || false,
                        'project': project
                    };
                });

                project.navigateDocs = p.docs.map(function (item) {
                    return {
                        'docId': item.docId,
                        'docName': item.docName,
                        'fileName': item.fileName,
                        'tags': item.tags,
                        'category': item.category || '',
                        'noDoc': item.noDoc || false
                    };
                }).filter(function (item) {
                    return item.noList !== true;
                });

                return project;
            };

            /**
             * @public
             * @description Get path of markdown document
             * @param {String} projectId
             * @param {String} docId
             * @returns {String} A valid path for project and document
             *      or return false for no mapped path
             */
            var getDocPath = function (projectId, docId) {
                var project = getProject(projectId);

                if (!project)
                    return false;

                var filePath = '/data/docs/';

                if (!docId) {
                    /* jshint laxbreak: true */
                    filePath += project.projectId + '/'
                            + (project.fileName || project.projectId);
                } else {
                    var doc = project.docs.filter(function (item) {
                        return item.docId === docId;
                    })[0];

                    if (!doc)
                        return false;

                    filePath += project.projectId + '/' + doc.fileName;
                }

                filePath += ".md";

                return filePath;
            };

            /**
             * @public
             * @description Get markdown document content
             * @param {String} projectId
             * @param {String} docId (optional)
             * @param {function} callback function which invoke after fetch data
             * @returns {undefined}
             */
            var getDocContent = function (projectId, docId, callback) {

                // handle request when we send only two param
                if (angular.isFunction(docId)) {
                    callback = docId;
                    docId = undefined;
                }

                var path = getDocPath(projectId, docId);

                if (!path) {
                    callback && callback(); //jshint ignore:line
                    return;
                }

                $log.debug(path);

                /*
                 $http.get(path).success(function (data) {
                 callback && callback(data);
                 }).error(function () {
                 callback && callback();
                 });
                 */

                $http.get(path).then(function (res) {
                    var headers = res.headers();
                    if (callback) {
                        callback({
                            'data': res.data,
                            'lastModified': headers['last-modified']
                        });
                    }
                }, function (err) {
                    callback && callback(); //jshint ignore:line
                });
            };

            /**
             * @public
             * @description Set projectId as current project
             * @param {String} projectId
             * @returns {undefined}
             */
            var setCurrentProject = function (projectId) {
                var project = undefined; // jshint ignore:line
                if (projectId) {
                    project = getProject(projectId);
                }
                $rootScope.$broadcast('changeProject', project);
            };

            /***
             * @public
             * @description Set docId as current document
             * @param {String} docId
             * @returns {undefined}
             */
            var setCurrentDoc = function (docId) {
                $rootScope.$broadcast('changeDoc', {'docId': docId});
            };

            var saveDocContent = function (projectId, docId, docContent, callback) {
                var docPath = getDocPath(projectId, docId);

                $http.post(config.apiSaveDoc, {path: docPath, content: docContent}).then(function (data) {
                    callback && callback(); // jshint ignore:line
                }, function (err) {
                    $log.debug(err);
                    if (err.status !== 401) {
                        var msg = err.data.error;
                        messageModalService.show('Error', msg, 'danger');
                    }
                });
            };

            var redirectTo = function (url, forceReload) {
                $rootScope.$broadcast('redirectTo', url, forceReload);
            };

            var getDocContentPromise = function (projectId, docId) {
                var defer = $q.defer();

                getDocContent(projectId, docId, function (data) {
                    $timeout(function () {
                        defer.resolve(data);
                    }, 100);
                });

                return defer.promise;
            };

            var fillAllDocList = function () {
                if (_allDocs)
                    return;

                _allDocs = [];
                for (var i = 0; i < data.length; i++) {
                    var p = getProject(data[i].projectId);

                    /*jshint loopfunc: true */
                    p.docs.forEach(function (item) {
                        _allDocs.push(item);
                    });
                }
            };

            var fillKeywords = function (docs, isContentSearch, callback) {
                if (!isContentSearch) {
                    callback && callback();  //jshint ignore:line
                } else {
                    var p;
                    for (var i = 0; i < docs.length; i++) {
                        /*jshint loopfunc: true */
                        (function () {
                            var doc = docs[i];

                            var allKeywords = localStorageService.get('docKeywords');
                            var docKeywordId = doc.project.projectId + '/' + doc.docId;// + ':' + (new Date()).getTime();
                            var currentTime = (new Date()).getTime();

                            if (!allKeywords) {
                                allKeywords = {};
                            }

                            var cacheExpiry = config.searchCacheExpiry || (60 * 60);

                            cacheExpiry *= 1000;

                            if (allKeywords[docKeywordId] && currentTime - allKeywords[docKeywordId].cachedTime > cacheExpiry) {
                                delete allKeywords[docKeywordId];
                                localStorageService.set('docKeywords', allKeywords);
                                //docKeywordObj = {};
                            }

                            var docKeywordObj = allKeywords[docKeywordId];

                            //var docKeywordId = 'docKeywords:' + doc.project.projectId + '/' + doc.docId;// + ':' + (new Date()).getTime();

                            //var cachedKeywords = localStorageService.get(docKeywordId);

                            if (docKeywordObj) {
                                doc.contentKeywords = docKeywordObj.keywords;
                            } else {
                                if (!p)
                                    p = getDocContentPromise(doc.project.projectId, doc.docId);
                                else
                                    p = p.then(function () {
                                        return getDocContentPromise(doc.project.projectId, doc.docId);
                                    });

                                p.then(function (data) {
                                    if (Object.prototype.toString.call(data) === '[object Object]')
                                        data = data.data;

                                    var contentKeywords = Project.getKeywords(data, doc.tags).join(',');

                                    doc.contentKeywords = (doc.tags ? doc.tags + ',' : '') + contentKeywords;

                                    //$log.debug(docKeywordId);

                                    //localStorageService.set(docKeywordId, doc.contentKeywords);

                                    var allKeywords = localStorageService.get('docKeywords') || {};

                                    allKeywords[docKeywordId] = {
                                        cachedTime: (new Date()).getTime(),
                                        keywords: doc.contentKeywords
                                    };

                                    localStorageService.set('docKeywords', allKeywords);

                                    return p;
                                });
                            }
                        })();
                    }

                    if (!p) {
                        callback && callback(); //jshint ignore:line
                    } else {
                        p.then(function () {
                            callback && callback(); //jshint ignore:line
                        });
                    }
                }
            };

            window.getDocContentPromise = getDocContentPromise;
            window.fillKeywords = fillKeywords;

            var searchDoc = function (term, docs, isContentSearch) {
                //var defer = $q.defer();
                if (angular.isUndefined(docs)) {
                    fillAllDocList();
                    docs = _allDocs;
                } else if (typeof docs === "boolean") {
                    fillAllDocList();
                    isContentSearch = docs;
                    docs = _allDocs;
                } else if (angular.isArray(docs)) {

                }

                if (isContentSearch === true) {
                    //fillKeywords(docs);
                }

                window.docs = docs;

                var searchResult = [];

                //searchResult.$promise = defer.promise;
                searchResult.$resolved = false;

                if (!term) {
                    // clear result on clearing search input
                    searchResult.$resolved = true;

                    //defer.resolve(searchResult);
                    return searchResult;
                }

                var terms = term.split(' ');

                fillKeywords(docs, isContentSearch, function () {

                    var results = [];

                    /*jshint loopfunc: true */
                    for (var i = 0; i < terms.length; i++) {
                        var result = docs.filter(function (item) {
                            //console.debug(item.tags, item);

                            var tags = item.tags;

                            if (isContentSearch)
                                tags = item.contentKeywords;

                            if (!tags)
                                return false;

                            // only retrun output which docs have content
                            if (item.noDoc === true)
                                return false;

                            tags = tags.split(',');

                            //console.debug(tags);

                            var s = tags.filter(function (tag) {
                                if (!isContentSearch)
                                    return tag.toLowerCase().indexOf(terms[i].toLowerCase()) !== -1;
                                else
                                    return tag.toLowerCase() === terms[i].toLowerCase();
                            });

                            //console.debug(s);

                            return 0 !== s.length;
                            //console.debug(item);
                        });

                        if (i === 0) {
                            results = result;
                        } else {
                            // This query reset results array with filter
                            // match more word
                            results = results.filter(function (item) {
                                return 0 !== result.filter(function (item2) {
                                    return item === item2;
                                }).length;
                            });
                        }
                    }

                    //$timeout(function () {
                    results.forEach(function (item) {
                        searchResult.push(item);
                    });

                    searchResult.$resolved = true;
                    //defer.resolve(searchResult);
                    //}, 1000);
                });

                return searchResult;
            };

            return {
                getProjectList: getProjectList,
                getProject: getProject,
                getDocPath: getDocPath,
                getDocContent: getDocContent,
                setCurrentProject: setCurrentProject,
                setCurrentDoc: setCurrentDoc,
                saveDocContent: saveDocContent,
                searchDoc: searchDoc,
                redirectTo: redirectTo
            };
        }]);

})();