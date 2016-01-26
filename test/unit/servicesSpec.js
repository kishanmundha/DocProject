/* global jasmine, expect */

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

        // load modules
        beforeEach(module('app'));

        var $httpBackend, docService;

        beforeEach(function () {
            Project.data.length = 0;

            Project.add('dms', 'Help for Document Management')
                    .addCategory('functions', 'Functions')
                    .addDoc('about', 'About', '', {"fileName": "dms"});
        });


        beforeEach(inject(function (_$httpBackend_, $rootScope, _docService_) {
            $httpBackend = _$httpBackend_;
            docService = _docService_;
            //$httpBackend.expectGET('/data/docs/dms/dms.md').
            //        respond('[link](/docs/dms)');

            //scope = $rootScope.$new();
        }));


        it('function getProjectList', function () {
            var docs = docService.getProjectList();

            expect(docs.length).toBe(1);

            expect(docs).toEqualData([{'projectId': 'dms', 'projectName': 'Help for Document Management'}]);
        });

        it('function getProject', function () {
            var p = docService.getProject('dms2');

            expect(p).not.toBeDefined();

            p = docService.getProject('dms');

            expect(p).toEqualData({
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

        xit('function getDocContetn', function () {
            $httpBackend.expectGET('/data/docs/dms/dms.md').
                    respond('[link](/docs/dms)');

            docService.getDocContent('dms', function (data) {
                expect(data).toBe('[link](/docs/dmskl)');
            });

            //$httpBackend.flush();
        });

        xit('function setCurrentProject', function () {

        });

        xit('function setCurrentDoc', function () {

        });

    });

    describe('authInterceptorService', function () {

        var authInterceptorService, localStorageService,
                authService, loginModalService;
        var localStorageData = {};

        beforeEach(module('app', function ($provide) {
            localStorageService = {};

            localStorageService.get = function (key) {
                return localStorageData[key];
            };
            localStorageService.set = function (key, value) {
                localStorageData[key] = value;
            };

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
});