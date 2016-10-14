(function () {
    'use strict';

    var app = angular.module('app');

    app.directive('progressCircular', ['$log', '$compile', function ($log, $compile) {
            $log.debug('progressCircular directive');

            return {
                restrict: 'EA',
                scope: {
                    size: '@'
                },
                replace: true,
                template: '<span></span>',
                link: function ($scope, element) {

                    $log.debug($scope.size);

                    /*
                     * normal size
                     * 
                     * cx = 50
                     * cy = 50
                     * r = 20
                     * 
                     * sm size
                     * 
                     * cx = 30
                     * cy = 30
                     * r = 10
                     */

                    var cx = 50;
                    var cy = 50;
                    var r = 20;
                    var animateClass = 'dash';
                    var strokeWidth = 3;

                    var width = 100;
                    var height = 100;

                    if ($scope.size === 'sm') {
                        cx = 11;
                        cy = 11;
                        r = 10;
                        animateClass = 'dash-sm';

                        width = 22;
                        height = 22;
                        strokeWidth = 2;
                    }

                    /* jshint laxbreak: true */
                    var html = '<svg style="animation: rotate 2s linear infinite; height: ' + height + 'px; width: ' + width + 'px; position: relative">'
                            + '<circle style="animation:' + animateClass + ' 1.5s ease-in-out infinite, color 6s ease-in-out infinite" cx="' + cx + '" cy="' + cy + '" r="' + r + '" stroke-dasharray="1,200" stroke-dashoffset="0" stroke-linecap="round" fill="none" stroke-width="' + strokeWidth + '" stroke-miterlimit="10"/>'
                            + '</svg>';
                    element.html(html);
                    var c = $compile(html)($scope);
                    element.replaceWith(c);
                }
            };
        }]);

})();