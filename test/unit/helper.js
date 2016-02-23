'use strict';

var isFunction = function (o) {
    return typeof o == 'function';
};


var bind,
        slice = [].slice,
        proto = Function.prototype,
        featureMap;

featureMap = {
    'function-bind': 'bind'
};

function has(feature) {
    var prop = featureMap[feature];
    return isFunction(proto[prop]);
}

// check for missing features
if (!has('function-bind')) {
    // adapted from Mozilla Developer Network example at
    // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function/bind
    bind = function bind(obj) {
        var args = slice.call(arguments, 1),
                self = this,
                Nop = function () {
                },
                bound = function () {
                    return self.apply(this instanceof Nop ? this : (obj || {}), args.concat(slice.call(arguments)));
                };
        Nop.prototype = this.prototype || {}; // Firefox cries sometimes if prototype is undefined
        bound.prototype = new Nop();
        return bound;
    };
    proto.bind = bind;
}

// Mock service
var getMockLocalStorage = function () {
    var localStorageData = {};
    var localStorageService = {};

    localStorageService.get = function (key) {
        return localStorageData[key];
    };
    localStorageService.set = function (key, value) {
        localStorageData[key] = value;
    };
    localStorageService.remove = function (key) {
        delete localStorageData[key];
    };
    localStorageService.clear = function() {
        localStorageData = {};
    };

    localStorageService.getItem = localStorageService.get;
    localStorageService.setItem = localStorageService.set;
    localStorageService.removeItem = localStorageService.remove;
    
    return localStorageService;
};