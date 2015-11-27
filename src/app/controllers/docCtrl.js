
        (function () {
            'use strict'
            
            var CONTENT_EMPTY_FILE = '<div>'
                    + '<h3><span class="glyphicon glyphicon-warning-sign"></span> Content not found</h3>'
                    + '<br/>'
                    + '<p style="line-height:30px"><span class="glyphicon glyphicon-circle-arrow-right"></span> Check your <code>data.js</code> file for mapped currectly.</p>'
                    + '<p style="line-height:30px"><span class="glyphicon glyphicon-circle-arrow-right"></span> Check file in directory, make sure file must exists.</p>'
                    + '<p style="line-height:30px"><span class="glyphicon glyphicon-circle-arrow-right"></span> Check file, make sure file must not blank.</p>'
                    + '</div>';

            var app = angular.module('app');

            app.controller('docCtrl', ['$scope', '$location', '$routeParams', '$timeout', '$sce', 'docService', function ($scope, $location, $routeParams, $timeout, $sce, docService) {
                    var projectId = $routeParams.projectId;
                    var docId = $routeParams.docId;

                    $scope.docContent;

                    $scope.markdown = {};

                    //console.debug($scope);

                    var content = docService.getDocContent(projectId, docId, function (data) {

                        if (data) {
                            $scope.markdown.outputText = trustAsHtml ( marked(data) );
                        }
                        else {
                            //$scope.markdown.outputText = marked('## Empty page');
                            $scope.markdown.outputText = trustAsHtml ( CONTENT_EMPTY_FILE );
                        }
                    });
                    
                    var trustAsHtml = function(string) {
                        return $sce.trustAsHtml(string);
                    };

                    if (!$scope.$parent.project || $scope.$parent.project.projectId != projectId) {
                        docService.setCurrentProject(projectId);
                    }

                    docService.setCurrentDoc(docId);
                }]);

        })();
