
        (function () {
            'use strict'
            
            var CONTENT_EMPTY_FILE = '<div style="max-width:200px; margin: 0px auto;">'
                    + '<h3><span class="glyphicon glyphicon-warning-sign"></span> Content not found</h3>'
                    + '<ul>'
                    + '<li style="line-height:40px">Check your data.js file for mapped currectly.</li>'
                    + '<li style="line-height:40px">Check file in directory, make sure file must exists</li>'
                    + '<li style="line-height:40px">Check file, make sure file must not blank</li>'
                    + '</ul>'
                    + '</div>';

            var app = angular.module('app');

            app.controller('docCtrl', ['$scope', '$location', '$routeParams', '$timeout', 'docService', function ($scope, $location, $routeParams, $timeout, docService) {
                    var projectId = $routeParams.projectId;
                    var docId = $routeParams.docId;

                    $scope.docContent;

                    $scope.markdown = {};

                    //console.debug($scope);

                    var content = docService.getDocContent(projectId, docId, function (data) {

                        if (data) {
                            $scope.markdown.outputText = marked(data);
                        }
                        else {
                            //$scope.markdown.outputText = marked('## Empty page');
                            $scope.markdown.outputText = CONTENT_EMPTY_FILE;
                        }
                    });

                    if (!$scope.$parent.project || $scope.$parent.project.projectId != projectId) {
                        docService.setCurrentProject(projectId);
                    }

                    docService.setCurrentDoc(docId);
                }]);

        })();