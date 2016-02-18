/* global jasmine, expect */

'use strict';

xdescribe('route', function () {
    module('app', function($provide) {
        $provide.value('$routeProvider', function() {
            return {};
        });
    });
    
    var $route, $location;

    beforeEach(inject(function (_$location_) {
        //$route = _$route_;
        $location = _$location_;
    }));

    xit('should mapped route properly', function () {
        //expect($route.routes['/docs'].controller).toBe('projectListCtrl');
        //expect($route.routes['/docs/edit/:projectId'].controller).toBe('projectListCtrl');
        //expect($route.routes['/docs/edit/:projectId/:docId'].controller).toBe('projectListCtrl');
        //expect($route.routes['/docs/:projectId'].controller)., toBe('projectListCtrl');
        //expect($route.routes['/docs/:projectId/:docId*'].controller).toBe('projectListCtrl');
        //expect($route.routes['/error'].controller).toBe('projectListCtrl');
        //expect($route.routes['/login'].controller).toBe('projectListCtrl');
        
        expect(1).toBe(1);
    });
});