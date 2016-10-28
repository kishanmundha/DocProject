'use strict';

/* jasmine specs for directives go here */

describe('directives', function() {
	var $compile,
      $rootScope,
	  $q,
	  $httpBackend;
	  
	// Load the app module, which contains the directive
	beforeEach(module('app', function ($provide) {
        $provide.value('authService', {
			login: function (user) {
				var deferred = $q.defer();
				if(user && user.username=='test' && user.password=='test')
					deferred.resolve('Success');
				else
					deferred.reject('Error');
				
				return deferred.promise;
			},
			fillAuthData: function() {
				
			}
		});
    }));
	
	// Store references to $rootScope and $compile
	// so they are available to all tests in this describe block
	beforeEach(inject(function(_$httpBackend_, _$compile_, _$rootScope_, _$q_){
		// The injector unwraps the underscores (_) from around the parameter names when matching
		$httpBackend = _$httpBackend_;
		$compile = _$compile_;
		$rootScope = _$rootScope_;
		$q = _$q_;
	}));
	
	it('notFound404 directive', function() {
		 var element = $compile("<not-found404></not-found404>")($rootScope);
		 $rootScope.$digest();
		 expect(element.html()).toContain('<div style="max-width: 600px; margin: 0px auto;"><center><h1 style="font-size:90px">404</h1></center><br><center><h4>Sorry, Requested data not found</h4></center></div>');
	});
	
	it('autoGrow directive', function() {
		var element = $compile("<textbox auto-grow></textbox>")($rootScope);
		 $rootScope.$digest();
		 expect(element.attr('ng-trim')).toEqual('false');
	});
	
	it('progressCircular directive', function() {
		var element = $compile("<div><progress-circular></progress-circular></div>")($rootScope);
		$rootScope.$digest();
		expect(element.html()).toEqual('<svg style="animation: rotate 2s linear infinite; height: 100px; width: 100px; position: relative" class="ng-scope"><circle style="animation:dash 1.5s ease-in-out infinite, color 6s ease-in-out infinite" cx="50" cy="50" r="20" stroke-dasharray="1,200" stroke-dashoffset="0" stroke-linecap="round" fill="none" stroke-width="3" stroke-miterlimit="10"></circle></svg>');
		
		element = $compile("<div><progress-circular size='sm'></progress-circular></div>")($rootScope);
		$rootScope.$digest();
		expect(element.html()).toEqual('<svg style="animation: rotate 2s linear infinite; height: 22px; width: 22px; position: relative" class="ng-scope"><circle style="animation:dash-sm 1.5s ease-in-out infinite, color 6s ease-in-out infinite" cx="11" cy="11" r="10" stroke-dasharray="1,200" stroke-dashoffset="0" stroke-linecap="round" fill="none" stroke-width="2" stroke-miterlimit="10"></circle></svg>');
	});
	
	it('loginForm directive', function() {

		var loginHtml = '<div>loginForm directive</div>';
		
		$httpBackend.expectGET('/app/partials/loginTemplate.html').
			respond(loginHtml);
			
		var $scope1 = $rootScope.$new();
        //set our view html.
        var element1 = $compile('<login-form ng-model="user"></login-form>')($scope1);
        $scope1.$digest();
		
		var $scope2 = $rootScope.$new();
		$scope2.user = {'username': 'test', 'password': 'test'};
        //set our view html.
        var element2 = $compile('<login-form ng-model="user"></login-form>')($scope2);
        $scope2.$digest();
		$httpBackend.flush();
		
		expect(element1.html()).toEqual(loginHtml);
		
		expect(element1.isolateScope().user).toEqual({});
		
		expect(element2.html()).toEqual(loginHtml);
		
		expect(element2.isolateScope().user).toEqual($scope2.user);
		
		element2.isolateScope().user.password = '';
		
		element2.isolateScope().login();
		
		element2.isolateScope().user.password = 'test2';
		
		element2.isolateScope().login();
		
		$scope1.$digest();
		$scope2.$digest();
		
		expect(element1.isolateScope().loginSuccessed).not.toBe(true);
		expect(element2.isolateScope().loginSuccessed).not.toBe(true);
		
		element2.isolateScope().user.password = 'test';
		element2.isolateScope().login();
		$scope2.$digest();

		expect(element2.isolateScope().loginSuccessed).toBe(true);
		
		//$scope.login()
		
		//
		
		//element.isolateScope();
	});
});
