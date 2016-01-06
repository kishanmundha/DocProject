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

    beforeEach(module('app'));

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
                    {'docId': 'doc', 'docName': 'Doc', 'category': '', 'tags': 'doc'}
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
        });
    });

    describe('docCtrl', function () {
        var rootScope, scope, ctrl, routeParams, sce;
        var controller;
        var docService;

        beforeEach(function () {
            docService = {
                getDocContent: function (projectId, docId, callback) {
                    if (docId === 'doc1') {
                        callback({'data': '[link](/docs/dms)', 'lastModified': undefined});
                    }
                    else {
                        callback('[link](/docs/dms)');
                    }
                },
                setCurrentDoc: function (docId) {

                },
                setCurrentProject: function (projectId) {

                }
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
            var outputText = scope.markdown.outputText.$$unwrapTrustedValue().trim();
            expect(outputText).toBe(expectHtml);
        });

        it('should show proper date ago string', function () {
            ctrl = controller('docCtrl', {$scope: scope, $routeParams: routeParams, $sce: sce, docService: docService});
            var d = new Date();

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

    /*it('test', function () {
     expect(1).toBe(1);
     expect([]).toEqualData([]);
     })*/

//  beforeEach(module('phonecatApp'));
//  beforeEach(module('phonecatServices'));
//
//  describe('PhoneListCtrl', function(){
//    var scope, ctrl, $httpBackend;
//
//    beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
//      $httpBackend = _$httpBackend_;
//      $httpBackend.expectGET('phones/phones.json').
//          respond([{name: 'Nexus S'}, {name: 'Motorola DROID'}]);
//
//      scope = $rootScope.$new();
//      ctrl = $controller('PhoneListCtrl', {$scope: scope});
//    }));
//
//
//    it('should create "phones" model with 2 phones fetched from xhr', function() {
//      expect(scope.phones).toEqualData([]);
//      $httpBackend.flush();
//
//      expect(scope.phones).toEqualData(
//          [{name: 'Nexus S'}, {name: 'Motorola DROID'}]);
//    });
//
//
//    it('should set the default value of orderProp model', function() {
//      expect(scope.orderProp).toBe('age');
//    });
//  });
//
//
//  describe('PhoneDetailCtrl', function(){
//    var scope, $httpBackend, ctrl,
//        xyzPhoneData = function() {
//          return {
//            name: 'phone xyz',
//                images: ['image/url1.png', 'image/url2.png']
//          }
//        };
//
//
//    beforeEach(inject(function(_$httpBackend_, $rootScope, $routeParams, $controller) {
//      $httpBackend = _$httpBackend_;
//      $httpBackend.expectGET('phones/xyz.json').respond(xyzPhoneData());
//
//      $routeParams.phoneId = 'xyz';
//      scope = $rootScope.$new();
//      ctrl = $controller('PhoneDetailCtrl', {$scope: scope});
//    }));
//
//
//    it('should fetch phone detail', function() {
//      expect(scope.phone).toEqualData({});
//      $httpBackend.flush();
//
//      expect(scope.phone).toEqualData(xyzPhoneData());
//    });
//  });
});
