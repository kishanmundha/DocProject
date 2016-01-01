(function () {
    'use strict';

    var app = angular.module('app');

    app.service('localStorageService', ['$log', function ($log) {

            var setItem = function (key, value) {
                if (window.localStorage === undefined)
                    return;

                $log.log('localStorage setItem => ', key);
                window.localStorage.setItem(key, JSON.stringify(value));
            };

            var removeItem = function (key) {
                if (window.localStorage === undefined)
                    return;

                $log.log('localStorage removeItem => ', key);
                window.localStorage.removeItem(key);
            };

            var getItem = function (key) {
                if (window.localStorage === undefined)
                    return;

                $log.log('localStorage getItem => ', key);
                var str = window.localStorage.getItem(key);

                if (!str)
                    return undefined;

                return JSON.parse(str);
            };

            var clear = function () {
                if (window.localStorage === undefined)
                    return;

                $log.log('localStorage clear');
                window.localStorage.clear();
            };

            return {
                setItem: setItem,
                set: setItem,
                getItem: getItem,
                get: getItem,
                removeItem: removeItem,
                remove: removeItem,
                clear: clear
            };
        }]);

})();