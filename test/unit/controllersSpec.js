/* global jasmine, expect, getMockLocalStorage, marked, hljs, $ */

'use strict';


/* jasmine specs for controllers go here */
describe('app controllers', function () {

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

    beforeEach(module('app', function ($provide) {
        $provide.value('localStorageService', getMockLocalStorage());
    }));

    describe('appCtrl', function () {
        var rootScope, scope, ctrl, location;

        beforeEach(inject(function ($rootScope, $controller, $location) {
            location = $location;
            rootScope = $rootScope;
            scope = $rootScope.$new();
            ctrl = $controller('appCtrl', {$scope: scope, $location: location});
        }));

        it('should search work proper', function () {
            scope.project = {
                docs: [
                    {'docId': 'doc-test', 'docName': 'Doc Test', 'category': '', 'tags': 'doc,test'},
                    {'docId': 'doc', 'docName': 'Doc', 'category': '', 'tags': 'doc'},
                    {'docId': 'no-doc', 'docName': 'No Doc', 'category': '', 'tags': 'doc', 'noDoc': true},
                    {'docId': 'no-tag', 'docName': 'No tag', 'category': '', 'tags': ''}
                ]
            };

            scope.searchPage('doc');
            expect(scope.searchResult.length).toEqual(2);

            scope.searchPage('doc test');
            expect(scope.searchResult.length).toEqual(1);

            scope.searchPage('test doc');
            expect(scope.searchResult.length).toEqual(1);

            scope.searchPage('test');
            expect(scope.searchResult.length).toEqual(1);

            scope.searchPage('docs');
            expect(scope.searchResult.length).toEqual(0);

            scope.searchPage('');
            expect(scope.searchResult.length).toEqual(0);

        });

        it('changeProject', function () {

            var p = {
                docs: [
                    {'docId': 'doc-test', 'docName': 'Doc Test', 'category': '', 'tags': 'doc,test'},
                    {'docId': 'doc', 'docName': 'Doc', 'category': '', 'tags': 'doc'}
                ]
            };

            var d = p[0];

            scope.changeProject(undefined);
            expect(scope.project).not.toBeDefined();

            scope.changeProject(p);
            expect(scope.project).toBe(p);

            rootScope.$broadcast('changeProject', undefined);
            expect(scope.project).not.toBeDefined();

            rootScope.$broadcast('changeProject', p);
            expect(scope.project).toBe(p);

            scope.changeDoc(undefined);
            expect(scope.currentDoc).not.toBeDefined();

            scope.changeDoc(d);
            expect(scope.currentDoc).toBe(d);

            rootScope.$broadcast('changeDoc', undefined);
            expect(scope.currentDoc).not.toBeDefined();

            rootScope.$broadcast('changeDoc', d);
            expect(scope.currentDoc).toBe(d);

            scope.setNavigationVisiblity(true);
            scope.search = 'search term';
            scope.setNavigationVisiblity(false);

            expect(scope.search).toBe('');

        });

		it('redirectTo', function() {
			rootScope.$broadcast('redirectTo', '/docs?q=search');
			rootScope.$broadcast('redirectTo', '/docs?q=search', true);
		});
    });

    describe('docCtrl', function () {
        var rootScope, scope, ctrl, routeParams, sce, timeout;
        var controller;
        var docService;

        beforeEach(function () {
            docService = {
                getDocContent: function (projectId, docId, callback) {
                    if (docId === 'doc1') {
                        callback({'data': '[link](/docs/dms)', 'lastModified': 'Fri, 28 Oct 2016 7:17:08 GMT'});
                    } else if(docId === 'doc2') {
                        callback('[link](/docs/dms)');
                    } else {
						callback();
					}
                },
                setCurrentDoc: function (docId) {

                },
                setCurrentProject: function (projectId) {

                }
            };
			
			timeout = function(fn) {
				fn();
			};
        });

        beforeEach(inject(function ($rootScope, $controller, $routeParams, $sce) {
            rootScope = $rootScope;
            scope = $rootScope.$new();
            routeParams = $routeParams;
            sce = $sce;
            controller = $controller;
        }));

        it('should show proper markdown', function () {

            var expectHtml = '<p><a href="/docs/dms">link</a></p>';

            routeParams.projectId = 'project-1';

            routeParams.docId = 'doc1';
            ctrl = controller('docCtrl', {$scope: scope, $routeParams: routeParams, $sce: sce, docService: docService});
            expect(scope.markdown.outputText).toBeDefined();
            var outputText = scope.markdown.outputText.$$unwrapTrustedValue().trim();
            expect(outputText).toBe(expectHtml);

            routeParams.docId = 'doc2';
            ctrl = controller('docCtrl', {$scope: scope, $routeParams: routeParams, $sce: sce, docService: docService});
            expect(scope.markdown.outputText).toBeDefined();
            outputText = scope.markdown.outputText.$$unwrapTrustedValue().trim();
            expect(outputText).toBe(expectHtml);
			
			rootScope.project = {projectId: 'project-2'};
			
			var _$_ = window.$;
			
			var hrefAttrCount = 0;
			window.$ = function() {
				return {
					on: function(action, fn) {
						switch(action) {
							case 'click':
								fn();
								fn();
								fn();
								break;
							default:
								fn();
						}
					},
					each: function(fn) {fn();},
					attr: function(attr) {
						var value;
						switch(attr) {
							case 'href':
								if(hrefAttrCount === 0)
									value = '';
								else if(hrefAttrCount === 1)
									value = 'a#';
								else
									value = '#a';
								hrefAttrCount++;
								break;
							case 'target':
								value = '';
								break;
							default:
								break;
						}
						return value;
					}
				};
			};
			routeParams.docId = 'doc3';
			ctrl = controller('docCtrl', {$scope: scope, $routeParams: routeParams, $sce: sce, docService: docService, $timeout: timeout});
			
			window.$ = _$_;
        });

        it('should show proper date ago string', function () {
            ctrl = controller('docCtrl', {$scope: scope, $routeParams: routeParams, $sce: sce, docService: docService});
            var d = new Date();

            // test for if time diffrence in negative
            d.setMinutes((d.getMinutes() + 2));
            expect(scope.getDateStringAgo(d)).toBe('few seconds');

            // set again orgianal time value
            d.setMinutes((d.getMinutes() - 2));

            expect(scope.getDateStringAgo(d)).toBe('few seconds');

            d.setSeconds(d.getSeconds() - 59);
            expect(scope.getDateStringAgo(d)).toBe('few seconds');

            d.setMinutes(d.getMinutes() - 1);
            expect(scope.getDateStringAgo(d)).toBe('1 minute');

            d.setMinutes(d.getMinutes() - 4);
            expect(scope.getDateStringAgo(d)).toBe('5 minutes');

            d.setHours(d.getHours() - 1);
            expect(scope.getDateStringAgo(d)).toBe('1 hour');

            d.setHours(d.getHours() - 1);
            expect(scope.getDateStringAgo(d)).toBe('2 hours');

            d.setDate(d.getDate() - 1);
            expect(scope.getDateStringAgo(d)).toBe('1 day');

            d.setDate(d.getDate() - 2);
            expect(scope.getDateStringAgo(d)).toBe('3 days');

            d.setDate(d.getDate() - 7);
            expect(scope.getDateStringAgo(d)).toBe('1 week');

            d.setDate(d.getDate() - 7);
            expect(scope.getDateStringAgo(d)).toBe('2 weeks');

            d.setMonth(d.getMonth() - 1);
            expect(scope.getDateStringAgo(d)).toBe('1 month');

            d.setMonth(d.getMonth() - 3);
            expect(scope.getDateStringAgo(d)).toBe('4 months');

            d.setFullYear(d.getFullYear() - 1);
            expect(scope.getDateStringAgo(d)).toBe('1 year');

            d.setFullYear(d.getFullYear() - 5);
            expect(scope.getDateStringAgo(d)).toBe('6 years');
        });
    });

    describe('editDocCtrl', function () {
        var rootScope, scope, ctrl, routeParams, sce, timeout;
        var controller;
        var docService;

        beforeEach(function () {
            docService = {
                getDocContent: function (projectId, docId, callback) {
                    if (docId === 'doc1') {
                        callback({'data': '[link](/docs/dms)', 'lastModified': undefined});
                    } else {
                        callback('[link](/docs/dms)');
                    }
                },
                setCurrentDoc: function (docId) {

                },
                setCurrentProject: function (projectId) {

                },
				saveDocContent: function(projectId, docId, inputText, fn) {
					fn();
				}
            };
			
			var istimeoutcalled = false;
			timeout = function(fn) {
				if(istimeoutcalled)
					return;
				
				istimeoutcalled = true;
				fn();
			};
			
			timeout.cancel = function() {};
        });

        beforeEach(inject(function ($rootScope, $controller, $routeParams, $sce) {
            rootScope = $rootScope;
            scope = $rootScope.$new();
            routeParams = $routeParams;
			$routeParams.projectId = 'project1';
			routeParams.docId = 'doc1';
            sce = $sce;
            controller = $controller;
        }));

        it('editDocCtrl', function () {
			var localStorageService = getMockLocalStorage();
			
			localStorageService.setItem('project1/doc1', {timestamp: new Date(1900, 1, 1), content: 'test'});
			
			var $window = {
				open: function() {}
			};

            //'$log', '$scope', '$routeParams', '$sce', '$window', 'docService', '$timeout', 'localStorageService', 'config', '$location'
            ctrl = controller('editDocCtrl', {$scope: scope, $routeParams: routeParams, $sce: sce, docService: docService, $timeout: timeout, localStorageService: localStorageService, $window: $window});
			
			scope.getSaveDurationString();
			scope.removeCache();
			scope.openSource();
			scope.save();
			
			scope.config.enableDocSave = false;
			
			scope.save();
			
			scope.showPreview();
			
			scope.markdown.inputText = '```test\na=0\n```';
			
			scope.$apply();
			
			marked.setOptions({
				renderer: new marked.Renderer(),
				gfm: true,
				tables: true,
				breaks: false,
				pedantic: false,
				sanitize: false, // if false -> allow plain old HTML ;)
				smartLists: true,
				smartypants: false,
				highlight: function (code, lang) {
					if (lang) {
						return hljs.highlight(lang, code).value;
					} else {
						return hljs.highlightAuto(code).value;
					}
				}
			});
			
			scope.showPreview();
			
			localStorageService.setItem('project1/doc1', {timestamp: new Date(), content: 'test'});
			ctrl = controller('editDocCtrl', {$scope: scope, $routeParams: routeParams, $sce: sce, docService: docService, $timeout: timeout, localStorageService: localStorageService});

			localStorageService.clear();
			ctrl = controller('editDocCtrl', {$scope: scope, $routeParams: routeParams, $sce: sce, docService: docService, $timeout: timeout, localStorageService: localStorageService});
			
			var config = {};
			config.editDoc = {};
			config.editDoc.autoSaveDuration = undefined;
			config.editDoc.autoSaveExpiry = undefined;
			var fnCtrl = function() {
				ctrl = controller('editDocCtrl', {$scope: scope, $routeParams: routeParams, $sce: sce, docService: docService, $timeout: timeout, localStorageService: localStorageService, config: config});
			};
			
			fnCtrl();
			scope.getSaveDurationString();
			
			config.editDoc.autoSaveDuration = 1; // 1 second
			
			fnCtrl();
			scope.getSaveDurationString();
			
			config.editDoc.autoSaveDuration = 1 * 2; // > 1 second
			
			fnCtrl();
			scope.getSaveDurationString();
			
			config.editDoc.autoSaveDuration = 1 * 60; // 1 minute
			
			fnCtrl();
			scope.getSaveDurationString();

			config.editDoc.autoSaveDuration = 1 * 60 * 2; // > 1 minute
			
			fnCtrl();
			scope.getSaveDurationString();

			config.editDoc.autoSaveDuration = 1 * 60 * 60; // 1 hour
			
			fnCtrl();

			scope.getSaveDurationString();
			config.editDoc.autoSaveDuration = 1 * 60 * 60 * 2; // > 1 hour
			
			fnCtrl();
			scope.getSaveDurationString();
			
			config.editDoc.autoSaveDuration = 1 * 60 * 60 * 60; // > 60 hour
			
			fnCtrl();
			scope.getSaveDurationString();
        });
    });

	describe('searchCtrl', function() {
        var rootScope, scope, ctrl, routeParams, timeout;
        var controller;
        var docService;
		
		beforeEach(function () {
			docService = {
				setCurrentProject: function() {},
				searchDoc: function() {return [];},
				redirectTo: function() {}
            };
			
			timeout = function(fn) {
				fn();
			};
        });
		
        beforeEach(inject(function ($rootScope, $controller, $routeParams) {
            rootScope = $rootScope;
            scope = $rootScope.$new();
            routeParams = $routeParams;
			routeParams.q = 'test';
            controller = $controller;
        }));
		
		it('should work search function proper', function() {
			ctrl = controller('searchCtrl', {$scope: scope, docService: docService, $timeout: timeout});
			
			expect(scope.searchResult).toEqual([]);
			
			scope.term = '';
			scope.search();
			
			scope.term = 'test';
			scope.search();
		});
	});

	describe('projectListCtrl', function() {
        var rootScope, scope, ctrl, routeParams, timeout;
        var controller;
        var docService;
		
		beforeEach(function () {
			docService = {
				setCurrentProject: function() {},
				getProjectList: function() {return [];}
            };
			
			timeout = function(fn) {
				fn();
			};
        });
		
        beforeEach(inject(function ($rootScope, $controller, $routeParams) {
            rootScope = $rootScope;
            scope = $rootScope.$new();
            controller = $controller;
        }));
		
		it('projectListCtrl', function() {
			ctrl = controller('projectListCtrl', {$scope: scope, docService: docService, $timeout: timeout});
			
			expect(scope.projects).toEqual([]);
		});
	});

	describe('loginCtrl', function() {
        var rootScope, scope, ctrl, routeParams;
        var controller;
		
		beforeEach(function () {
        });
		
        beforeEach(inject(function ($rootScope, $controller, $routeParams) {
            rootScope = $rootScope;
            scope = $rootScope.$new();
            controller = $controller;
        }));
		
		it('loginCtrl', function() {
			ctrl = controller('loginCtrl', {$scope: scope});
			
			scope.onLogin();
		});
	});

});
