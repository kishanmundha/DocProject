(function () {
    'use strict';

    var app = angular.module('app');

    app.directive("autoGrow", function () {
        return function (scope, element, attr) {
            var update = function () {
                element.css("height", "auto");
                element.css("height", element[0].scrollHeight + "px");
            };
            scope.$watch(attr.ngModel, function () {
                update();
            });
            attr.$set("ngTrim", "false");
        };
    });

})();
