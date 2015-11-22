
(function () {
    'use strict'

    var app = angular.module('app');

    app.service('docService', ['$http', '$rootScope', function ($http, $rootScope) {

        var getProjectList = function () {
            return data.map(function (item) {
                return { 'projectId': item.projectId, 'projectName': item.projectName };
            });
        }

        var getProject = function (projectId) {
            var p = data.filter(function (item) {
                return item.projectId == projectId;
            })[0];

            if (!p)
                return;

            var project = {
                'projectId': p.projectId,
                'projectName': p.projectName,
                'fileName': p.fileName,
                'categories': p.categories,
                'docs': p.docs.map(function (item) {
                    return { 'docId': item.docId, 'docName': item.docName, 'fileName': item.fileName, 'tags': item.tags, 'category': item.category || '', 'noDoc': item.noDoc || false };
                })
            }

            return project;
        }

        var getDocPath = function (projectId, docId) {
            var project = getProject(projectId);

            if (!project)
                return false;

            var filePath = 'data/docs/';

            if (!docId) {
                filePath += project.projectId + '/' + (project.fileName || project.projectId);
            }
            else {
                var doc = project.docs.filter(function (item) {
                    return item.docId == docId;
                })[0];

                if (!doc)
                    return false;

                filePath += project.projectId + '/' + (doc.fileName || doc.docId);
            }

            filePath += ".md";

            return filePath;
        }

        var getDocContent = function (projectId, docId, callback) {
            var path = getDocPath(projectId, docId);

            if (!path) {
                callback && callback();
                return;
            }

            console.debug(path);

            $http.get(path).success(function (data) {
                callback && callback(data);
            }).error(function () {
                callback && callback();
            });
        }

        var setCurrentProject = function (projectId) {
            var project = undefined;
            if (projectId) {
                project = getProject(projectId)
            }
            $rootScope.$broadcast('changeProject', project);
        }

        var setCurrentDoc = function (docId) {
            $rootScope.$broadcast('changeDoc', {'docId': docId});
        }

        return {
            data: data,
            getProjectList: getProjectList,
            getProject: getProject,
            getDocContent: getDocContent,
            setCurrentProject: setCurrentProject,
            setCurrentDoc: setCurrentDoc
        }
    }]);

})();