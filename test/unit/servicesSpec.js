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

    // load modules
    beforeEach(module('app'));

    describe('docService', function () {
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

        xit('function setCurrentProject', function() {
            
        });
        
        xit('function setCurrentDoc', function() {
            
        });

    });

});