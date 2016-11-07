(function () {
    'use strict';

    /* jshint laxbreak: true */
    var CONTENT_EMPTY_FILE = '<div>'
            + '<h3><span class="glyphicon glyphicon-warning-sign"></span> Content not found</h3>'
            + '<br/>'
            + '<p style="line-height:30px"><span class="glyphicon glyphicon-circle-arrow-right"></span> Check your <code>data.js</code> file for mapped currectly.</p>'
            + '<p style="line-height:30px"><span class="glyphicon glyphicon-circle-arrow-right"></span> Check file in directory, make sure file must exists.</p>'
            + '<p style="line-height:30px"><span class="glyphicon glyphicon-circle-arrow-right"></span> Check file, make sure file must not blank.</p>'
            + '</div>';
    var app = angular.module('app');
    app.controller('docCtrl', ['$log', '$scope', '$routeParams', '$sce', 'docService', '$timeout', '$anchorScroll', 'config',
        function ($log, $scope, $routeParams, $sce, docService, $timeout, $anchorScroll, config) {
            $log.debug('docCtrl controller called');

            var projectId = $routeParams.projectId;
            var docId = $routeParams.docId;
            $scope.projectId = projectId;
            $scope.docId = docId;
            $scope.docContent = undefined;
            $scope.lastModified = undefined;
            $scope.config = config;

            $scope.enableEditDoc = config.enableEditDoc;

            $scope.markdown = {};
            //console.debug($scope);

            var trustAsHtml = function (string) {
                return $sce.trustAsHtml(string);
            };

            function _sin_plu(a, s) {

                // we trust on param
                // it will never less then 1
                // and it always be numeric
                // 
                // if (isNaN(a) || a < 1)
                //    return a + " " + s;

                if (a === 1) {
                    return a + " " + s;
                }

                return a + " " + s + 's';
            }

            function getDateStringAgo(date) {
                var d1 = new Date(date);
                var d2 = new Date();

                var dd = new Date(d2 - d1);

                var year = dd.getUTCFullYear() - 1970;
                var month = dd.getUTCMonth();
                var day = dd.getUTCDate() - 1;
                var hour = dd.getUTCHours();
                var minute = dd.getUTCMinutes();

                var s = "";
                if (year < 0) {
                    s += "few seconds";
                } else if (year > 0) {
                    s += _sin_plu(year, 'year');
                } else if (month > 0) {
                    s += _sin_plu(month, 'month');
                } else if (day > 0) {
                    if (day < 7) {
                        s += _sin_plu(day, 'day');
                    } else {
                        s += _sin_plu(Math.floor(day / 7), 'week');
                    }
                } else if (hour > 0) {
                    s += _sin_plu(hour, 'hour');
                } else if (minute > 0) {
                    s += _sin_plu(minute, 'minute');
                } else {
                    s += "few seconds";
                }

                return s;
                //return $date;
            }
            $scope.getDateStringAgo = getDateStringAgo;

            docService.getDocContent(projectId, docId, function (data) {

                $scope.docLoaded = true;

                if (Object.prototype.toString.call(data) === '[object Object]') {
                    if (data.lastModified) {
                        $scope.lastModified = new Date(data.lastModified);
                    }
                    data = data.data;
                }

                if (data) {
                    $scope.markdown.outputText = trustAsHtml(marked(data));
                } else {
                    $scope.enableEditDoc = false;
                    $scope.markdown.outputText = trustAsHtml(CONTENT_EMPTY_FILE);
                }

                // bookmark support using $anchorScroll
                $timeout(function () {
                    $anchorScroll();
                }, 1);

                $timeout(function () {
                    $log.debug($('#docOutput a'));
                    $('#docOutput a').on('click', function (e) {

                        var href = $(this).attr('href');

                        if (!href || href.indexOf('#') !== 0) {
                            return;
                        }

                        $log.debug('bookmark link pressed');

                        $anchorScroll();
                    });
                }, 100);

                // add target="_self" for path /data/...
                $timeout(function () {
                    $log.debug($('#docOutput a'));

                    $('#docOutput a[href^="/data/"]').each(function () {
                        if (!$(this).attr('target'))
                            $(this).attr('target', '_self');
                    });
                }, 100);
            });

            if (!$scope.$parent.project || $scope.$parent.project.projectId !== projectId) {
                docService.setCurrentProject(projectId);
            }

            docService.setCurrentDoc(docId);
        }]);
})();
