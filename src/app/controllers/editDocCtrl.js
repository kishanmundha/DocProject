
        (function () {
            'use strict';

            var app = angular.module('app');

            app.controller('editDocCtrl', ['$scope', '$routeParams', '$sce', '$window', 'docService', function ($scope, $routeParams, $sce, $window, docService) {
                    var projectId = $routeParams.projectId;
                    var docId = $routeParams.docId;

                    $scope.projectId = projectId;
                    $scope.docId = docId;

                    $scope.docContent;

                    $scope.markdown = {};

                    //console.debug($scope);

                    docService.getDocContent(projectId, docId, function (data) {

                        if (Object.prototype.toString.call(data) === '[object Object]') {
                            data = data.data;
                        }

                        $scope.markdown.inputText = data;

                        //parseMarkdownContent();
                    });

                    var trustAsHtml = function (string) {
                        return $sce.trustAsHtml(string);
                    };

                    var parseMarkdownContent = function () {
                        var mdContent = '';
                        try {
                            mdContent = marked($scope.markdown.inputText);
                            mdContent = '<div class="alert alert-warning" role="alert">Do not press on any link other wise your content will lost</div>' + mdContent;
                        }
                        catch (e) {
                            mdContent = '<div class="alert alert-danger" role="alert">' + e + '</div>';
                            //console.error(e.message);
                            //throw e;
                        }

                        $scope.markdown.outputText = trustAsHtml(mdContent);
                    };

                    docService.setCurrentProject(false);

                    $scope.showPreview = function () {

                        parseMarkdownContent();

                        $scope.isPreview = true;
                    };
                    
                    $scope.openSource = function() {
                        var base64Data = btoa($scope.markdown.inputText);
                        $window.open('data:text/plain;base64,' + base64Data);
                    };
                }]);

        })();
