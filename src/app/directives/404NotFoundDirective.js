(function () {
    'use strict';

    var app = angular.module('app');

    app.directive('notFound404', ['$log', 'config', function ($log, config) {
            $log.debug('quotationList directive');

            return {
                restrict: 'EA',
                /* jshint laxbreak: true */
                template: '<div style="max-width: 600px; margin: 0px auto;">'
                        + '<center>'
                        + '<h1 style="font-size:90px">404</h1>'
                        + '</center>'
                        + '<br/>'
                        + '<center>'
                        + '<h4>'
                        + 'Sorry, Requested data not found'
                        + '</h4>'
                        + '</center>'
                        + '</div>'
            };
        }]);

})();