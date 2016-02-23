/* global jasmine, expect, getMockLocalStorage */

'use strict';

describe('service', function () {

    beforeEach(function () {
        jasmine.addMatchers({
            toEqualData: function () {
                return {
                    compare: function (actual, expected) {
                        return {pass: angular.equals(actual, expected)};
                    }
                };
            }
        });
    });

    describe('docService', function () {

        beforeEach(module('app', function ($provide) {
            $provide.value('localStorageService', getMockLocalStorage());
        }));

        var $httpBackend, docService, $rootScope, appCtrlScope;
        var project;

        beforeEach(function () {
            Project.data.length = 0;

            project = Project.add('dms', 'Help for Document Management');

            project.addCategory('functions', 'Functions')
                    .addDoc('about', 'About', '', {"fileName": "dms"})
                    ;
        });


        beforeEach(inject(function (_$httpBackend_, _$rootScope_, _docService_) {
            $httpBackend = _$httpBackend_;
            docService = _docService_;
            $rootScope = _$rootScope_;
            //spyOn($rootScope, '$broadcast');
            //spyOn($rootScope, "$on");

            appCtrlScope = $rootScope.$new();
            appCtrlScope.changeProject = function () {};
            appCtrlScope.changeDoc = function () {};
            spyOn(appCtrlScope, 'changeProject');
            spyOn(appCtrlScope, 'changeDoc');
            appCtrlScope.$on('changeProject', function (evt, args) {
                appCtrlScope.changeProject(args);
            });
            appCtrlScope.$on('changeDoc', function (evt, args) {
                appCtrlScope.changeDoc(args);
            })
        }));


        it('function getProjectList', function () {
            var docs = docService.getProjectList();

            expect(docs.length).toBe(1);

            expect(docs).toEqual([{'projectId': 'dms', 'projectName': 'Help for Document Management'}]);
        });

        it('function getProject', function () {
            var p = docService.getProject('dms2');

            expect(p).not.toBeDefined();

            p = docService.getProject('dms');

            expect(p).toEqual({
                projectId: 'dms',
                projectName: 'Help for Document Management',
                fileName: undefined,
                categories: [{name: '', display: ''}, {name: 'functions', display: 'Functions'}],
                docs: [{docId: 'about', docName: 'About', fileName: 'dms', tags: '', category: '', noDoc: false, noList: false}],
                navigateDocs: [{docId: 'about', docName: 'About', fileName: 'dms', tags: '', category: '', noDoc: false}]
            });
        });

        it('function getDocPath', function () {
            expect(docService.getDocPath('dms')).toBe('/data/docs/dms/dms.md');
            expect(docService.getDocPath('dms', '')).toBe('/data/docs/dms/dms.md');
            expect(docService.getDocPath('dms', 'about')).toBe('/data/docs/dms/dms.md');

            expect(docService.getDocPath('dms2')).toBe(false);
            expect(docService.getDocPath('dms', 'dms2')).toBe(false);
        });

        it('function getDocContent', function () {
            $httpBackend.expectGET('/data/docs/dms/dms.md').
                    respond('[link](/docs/dms)');

            docService.getDocContent('dms', function (data) {
                expect(data).toEqual({data: '[link](/docs/dms)', lastModified: undefined});
            });

            $httpBackend.flush();

            $httpBackend.expectGET('/data/docs/dms/dms.md').
                    respond(404);

            docService.getDocContent('dms', function (data) {
                expect(data).toBeUndefined();
            });

            $httpBackend.flush();

            docService.getDocContent('noproject', function (data) {
                expect(data).toBeUndefined();
            });
        });

        it('function setCurrentProject', function () {
            var project = docService.getProject('dms');
            docService.setCurrentProject('dms');
            expect(appCtrlScope.changeProject).toHaveBeenCalledWith(project);

            docService.setCurrentProject('test');
            expect(appCtrlScope.changeProject).toHaveBeenCalledWith(undefined);
        });

        it('function setCurrentDoc', function () {
            var project = docService.getProject('dms');
            docService.setCurrentDoc('about');
            expect(appCtrlScope.changeDoc).toHaveBeenCalledWith({'docId': 'about'});
        });

        it('function saveDocContent', function () {
            var obj = {};
            obj.callback = function () {};
            spyOn(obj, 'callback');

            $httpBackend.expectPOST('/api/saveDoc', {"path": false, "content": "test content"}).
                    respond(400, {'error': 'test error'});

            docService.saveDocContent('dms', 'dms2', 'test content', obj.callback);
            expect(obj.callback).not.toHaveBeenCalled();

            $httpBackend.flush();

            expect(obj.callback).not.toHaveBeenCalled();

            $httpBackend.expectPOST('/api/saveDoc', {"path": "/data/docs/dms/dms.md", "content": "test content"}).
                    respond(200);

            docService.saveDocContent('dms', 'about', 'test content', obj.callback);
            expect(obj.callback).not.toHaveBeenCalled();

            $httpBackend.flush();

            expect(obj.callback).toHaveBeenCalled();
        });

    });

    describe('authInterceptorService', function () {

        var authInterceptorService, localStorageService,
                authService, loginModalService;

        beforeEach(module('app', function ($provide) {
            localStorageService = getMockLocalStorage();
            $provide.value('localStorageService', localStorageService);

            authService = {};
            authService.logOut = jasmine.createSpy();
            authService.fillAuthData = jasmine.createSpy();

            loginModalService = {};
            loginModalService.login = jasmine.createSpy();

            $provide.value('authService', authService);
            $provide.value('loginModalService', loginModalService);
        }));

        beforeEach(inject(function (_authInterceptorService_) {
            authInterceptorService = _authInterceptorService_;
        }));

        it('request should add header token', function () {

            var config = {};

            config = authInterceptorService.request(config);
            expect(config).toEqual({headers: {}});

            localStorageService.set('authorizationData', {token: 'token-1'});

            config = authInterceptorService.request(config);
            expect(config).toEqual({headers: {'x-access-token': 'token-1'}});
        });

        it('response error should call to login', function () {

            authInterceptorService.responseError({status: 400});

            expect(authService.logOut).not.toHaveBeenCalled();
            expect(loginModalService.login).not.toHaveBeenCalled();

            authInterceptorService.responseError({status: 401});

            expect(authService.logOut).toHaveBeenCalled();
            expect(loginModalService.login).toHaveBeenCalled();
        });

    });

    describe('authService', function () {

        var $httpBackend, config, localStorageService, authService;

        beforeEach(module('app', function ($provide) {
            $provide.value('localStorageService', getMockLocalStorage());
        }));

        beforeEach(inject(function (_$httpBackend_, _config_, _localStorageService_, _authService_) {
            $httpBackend = _$httpBackend_;
            config = _config_;
            localStorageService = _localStorageService_;
            authService = _authService_;
        }));

        it('login success test', function () {
            $httpBackend.expectPOST('/api/login', {}).
                    respond({
                        token: 'token1',
                        username: 'user1',
                        first_name: 'first_name1',
                        last_name: 'last_name1',
                        email: 'test@test.com'
                    });

            expect(localStorageService.get('authorizationData')).toBeUndefined();
            expect(authService.isAuthenticated()).toBe(false);

            authService.login({});

            $httpBackend.flush();

            expect(localStorageService.get('authorizationData')).toEqual({
                token: 'token1',
                username: 'user1',
                first_name: 'first_name1',
                last_name: 'last_name1',
                email: 'test@test.com'
            });

            expect(authService.isAuthenticated()).toBe(true);
        });

        it('login fail test', function () {
            $httpBackend.expectPOST('/api/login', {}).
                    respond(400, 'bad request');

            authService.login({});

            $httpBackend.flush();

            expect(localStorageService.get('authorizationData')).toBeUndefined();
            expect(authService.isAuthenticated()).toBe(false);
        });

        it('logout test', function () {
            localStorageService.set('authorizationData', {token: 'token1'});
            authService.authentication.isAuth = true;

            authService.logOut();

            expect(localStorageService.get('authorizationData')).toBeUndefined();
            expect(authService.isAuthenticated()).toBe(false);
        });

        it('fillAuthData and get user info test', function () {

            authService.fillAuthData();

            expect(authService.isAuthenticated()).toBe(false);

            var authData = {
                token: 'token1',
                username: 'user1',
                first_name: 'firstname',
                last_name: 'lastname',
                email: 'test@test.com'
            };

            localStorageService.set('authorizationData', authData);

            // authentication should not use localStorage
            expect(authService.isAuthenticated()).toBe(false);

            authService.fillAuthData();

            expect(authService.isAuthenticated()).toBe(true);

            expect(authService.getFirstName()).toBe('firstname');
            expect(authService.getUserFullName()).toBe('firstname lastname');
            expect(authService.getUserEmail()).toBe('test@test.com');

            authData.last_name = '';

            authService.fillAuthData();

            expect(authService.getUserFullName()).toBe('firstname');
        });
    });

    describe('localStorageService', function () {

        var _windowLocalStorage, _windowLocalStorageFuncs = {};

        beforeEach(function () {
            // we can't send a reserved variable value
            // so we set property of it

            _windowLocalStorage = window.localStorage;
            _windowLocalStorageFuncs.setItem = window.localStorage.setItem;
            _windowLocalStorageFuncs.getItem = window.localStorage.getItem;
            _windowLocalStorageFuncs.removeItem = window.localStorage.removeItem;
            _windowLocalStorageFuncs.clear = window.localStorage.clear;
            var localStorage = getMockLocalStorage();

            window.localStorage.setItem = localStorage.setItem;
            window.localStorage.getItem = localStorage.getItem;
            window.localStorage.removeItem = localStorage.removeItem;
            window.localStorage.clear = localStorage.clear;

        });

        afterEach(function () {
            //window.localStorage = _windowLocalStorage;

            window.localStorage.setItem = _windowLocalStorageFuncs.setItem;
            window.localStorage.getItem = _windowLocalStorageFuncs.getItem;
            window.localStorage.removeItem = _windowLocalStorageFuncs.removeItem;
            window.localStorage.clear = _windowLocalStorageFuncs.clear;
        });

        beforeEach(module('app'));

        var localStorageService;

        beforeEach(inject(function (_localStorageService_) {
            localStorageService = _localStorageService_;
        }));

        it('test', function () {
            localStorageService.setItem('string', 'test string');
            expect(localStorageService.getItem('string')).toBe('test string');
            localStorageService.removeItem('string');
            expect(localStorageService.getItem('string')).toBeUndefined();

            localStorageService.set('number', 10);
            expect(localStorageService.get('number')).toBe(10);
            localStorageService.removeItem('number');
            expect(localStorageService.getItem('number')).toBeUndefined();

            localStorageService.set('object', {"key": "value"});
            expect(localStorageService.get('object')).toEqual({"key": "value"});
            localStorageService.clear();
            expect(localStorageService.getItem('object')).toBeUndefined();

            /* We can't test this right now
             // test when `window.localStorage` not available
             window.localStorage = undefined;
             
             localStorageService.setItem('string', 'test string');
             localStorageService.set('number', 10);
             
             expect(localStorageService.getItem('string')).toBeUndefined();
             expect(localStorageService.get('number')).toBeUndefined();
             
             localStorageService.clear();
             */
        });
    });
});