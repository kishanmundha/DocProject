
(function () {
    'use strict';

    var app = angular.module('app');

    app.service('docService', ['$log', '$http', '$rootScope',
        function ($log, $http, $rootScope) {

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
                'categories': p.categories,
                'docs': p.docs.map(function (item) {
                    return {
                        'docId': item.docId,
                        'docName': item.docName,
                        'fileName': item.fileName,
                        'tags': item.tags,
                        'category': item.category || '',
                        'noDoc': item.noDoc || false,
                        'noList': item.noList || false
                    };
                }),
                'navigateDocs': p.docs.map(function (item) {
                    return {
                        'docId': item.docId,
                        'docName': item.docName,
                        'fileName': item.fileName,
                        'tags': item.tags,
                        'category': item.category || '',
                        'noDoc': item.noDoc || false
                    };
                }).filter(function(item) {
                    return item.noList !== true;
                })
            };

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
                filePath += project.projectId + '/'
                        + (project.fileName || project.projectId);
            }
            else {
                var doc = project.docs.filter(function (item) {
                    return item.docId === docId;
                })[0];

                if (!doc)
                    return false;

                filePath += project.projectId + '/'
                        + (doc.fileName || doc.docId);
            }

            filePath += ".md";

            return filePath;
        };

        /**
         * @public
         * @description Get markdown document content
         * @param {String} projectId
         * @param {String} docId
         * @param {function} callback function which invoke after fetch data
         * @returns {undefined}
         */
        var getDocContent = function (projectId, docId, callback) {
            var path = getDocPath(projectId, docId);

            if (!path) {
                callback && callback();
                return;
            }

            $log.log(path);

            /*
            $http.get(path).success(function (data) {
                callback && callback(data);
            }).error(function () {
                callback && callback();
            });
            */
           
           $http.get(path).then(function(res) {
               var headers = res.headers();
               callback && callback({
                   'data': res.data,
                   'lastModified': headers['last-modified']
               });
           }, function(err) {
               callback && callback();
           });
        };

        /**
         * @public
         * @description Set projectId as current project
         * @param {String} projectId
         * @returns {undefined}
         */
        var setCurrentProject = function (projectId) {
            var project = undefined;
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

        return {
            getProjectList: getProjectList,
            getProject: getProject,
            getDocPath: getDocPath,
            getDocContent: getDocContent,
            setCurrentProject: setCurrentProject,
            setCurrentDoc: setCurrentDoc
        };
    }]);

})();