(function () {
    'use strict';

    var app = angular.module('app');

    app.controller('editDocCtrl', ['$log', '$scope', '$routeParams', '$sce', '$window', 'docService', '$timeout', 'localStorageService', 'config', '$location',
        function ($log, $scope, $routeParams, $sce, $window, docService, $timeout, localStorageService, config, $location) {
            $log.debug('editDocCtrl called');

            var projectId = $routeParams.projectId;
            var docId = $routeParams.docId;

            var autoSaveDuration = (config.editDoc.autoSaveDuration || (60)) * 1000;
            var autoSaveExpiry = (config.editDoc.autoSaveExpiry || (60 * 60)) * 1000;    // 1 hour

            $scope.getSaveDurationString = function () {
                var s = autoSaveDuration / 1000;

                if (s === 1)
                    return 'second';

                if (s <= 59) {
                    return s + ' second';
                }

                var m = parseInt(s / 60);

                if (m === 1)
                    return 'minute';

                if (m <= 59)
                    return m + ' minute';

                var h = parseInt(m / 60);

                if (h === 1)
                    return 'hour';

                if (h <= 59)
                    return h + ' hour';

                return '10 minute';
            };

            $scope.projectId = projectId;
            $scope.docId = docId;

            var timer;

            $scope.config = config;

            $scope.docContent = undefined;

            $scope.markdown = {};

            //console.debug($scope);

            var saveToCache = function () {
                var obj = {
                    timestamp: (new Date()).getTime(),
                    content: $scope.markdown.inputText
                };

                var key = projectId;

                if (docId)
                    key += '/' + docId;

                localStorageService.setItem(key, obj);

                $scope.cacheTime = new Date(obj.timestamp);
            };

            var removeCache = function () {
                var key = projectId;

                if (docId)
                    key += '/' + docId;

                $scope.cacheTime = undefined;
                localStorageService.removeItem(key);

                getDocContent();
            };

            var getDocFromCache = function () {
                var key = projectId;

                if (docId)
                    key += '/' + docId;

                var obj = localStorageService.getItem(key);

                if (!obj)
                    return;

                if ((new Date()).getTime() - obj.timestamp > autoSaveExpiry) {
                    removeCache();
                    return '';
                }

                if (obj.content) {
                    $scope.cacheTime = new Date(obj.timestamp);
                }

                $scope.markdown.inputText = obj.content;

                saveToCache();
            };

            var getDocContent = function (getOnly) {
                docService.getDocContent(projectId, docId, function (data) {

                    if (Object.prototype.toString.call(data) === '[object Object]') {
                        data = data.data;
                    }

                    data = data.replace(/\r\n/g, '\n');

                    $scope.markdown.orignalValue = data;

                    if (!getOnly) {
                        $scope.markdown.inputText = data;
                    }

                    //parseMarkdownContent();
                });
            };

            // auto save to local storage
            var runTimeout = function () {
                timer = $timeout(function () {
                    saveToCache();
                    runTimeout();
                }, autoSaveDuration);
            };

            getDocFromCache();
            getDocContent($scope.markdown.inputText !== undefined);

            var trustAsHtml = function (string) {
                return $sce.trustAsHtml(string);
            };

            var parseMarkdownContent = function () {
                var mdContent = '';
                try {
                    mdContent = marked($scope.markdown.inputText);
                    mdContent = '<div class="alert alert-warning" role="alert">Do not press on any link other wise your content will lost</div>' + mdContent;
                } catch (e) {
                    mdContent = '<div class="alert alert-danger" role="alert">' + e + '</div>';
                    //console.error(e.message);
                    //throw e;
                }

                $scope.markdown.outputText = trustAsHtml(mdContent);
            };

            $scope.showPreview = function () {
                parseMarkdownContent();

                $log.debug('showing preview');

                if (config.editDoc.autoLocalSave) {
                    saveToCache();
                }
            };

            $scope.openSource = function () {
                var base64Data = btoa($scope.markdown.inputText);
                $window.open('data:text/plain;base64,' + base64Data);
            };

            $scope.save = function () {
                if (!$scope.config.enableDocSave)
                    return;

                docService.saveDocContent(projectId, docId, $scope.markdown.inputText, function () {
                    var key = projectId;

                    if (docId)
                        key += '/' + docId;

                    $location.path('/docs/' + key);

                    $timeout.cancel(timer);
                    removeCache();
                });
            };

            $scope.removeCache = removeCache;

            // remove timer on route change
            $scope.$on('$destroy', function (e) {
                $timeout.cancel(timer);
            });

            docService.setCurrentProject(false);

            if (config.editDoc.autoLocalSave) {
                runTimeout();
            }
        }]);

})();
