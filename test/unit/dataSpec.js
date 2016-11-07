/* global Project, expect */

'use strict';


describe('data service', function () {

    beforeEach(function () {
        Project.data.length = 0;
    });

    it('Project should add properly', function () {
        Project.add('test-project', 'Test Project');

        expect(Project.data.length).toBe(1);
        expect(Project.data[0].projectId).toBe('test-project');
        expect(Project.data[0].projectName).toBe('Test Project');
        expect(Project.data[0].docs.length).toBe(0);
        expect(Project.data[0].categories.length).toBe(1);
        expect(Project.data[0].categories[0].name).toBe('');
        expect(Project.data[0].categories[0].display).toBe('');

        Project.add('test-project-2', 'Test Project 2');

        expect(Project.data.length).toBe(2);
    });

    it('duplicate projectId should reject', function () {
        Project.add('test-project', 'Test Project');
        Project.add('test-project', 'Test Project');

        expect(Project.data.length).toBe(1);
    });

    it('empty projectId should reject', function () {
        Project.add('', 'Test Project');

        expect(Project.data.length).toBe(0);
    });

    it('empty project name should reject', function () {
        Project.add('test-project', '');

        expect(Project.data.length).toBe(0);
    });

    it('add category should work properly', function () {
        Project.add('test-project', 'Test project')
                .addCategory('test-category', 'Test category');

        expect(Project.data[0].categories.length).toBe(2);
        expect(Project.data[0].categories[1].name).toBe('test-category');
        expect(Project.data[0].categories[1].display).toBe('Test category');
    });

    it('duplicate category should reject', function () {
        Project.add('test-project', 'Test project')
                .addCategory('test-category', 'Test category')
                .addCategory('test-category', 'Test category');

        expect(Project.data[0].categories.length).toBe(2);
    });

    it('empty category should reject', function () {
        Project.add('test-project', 'Test project')
                .addCategory('', 'Test category');

        expect(Project.data[0].categories.length).toBe(1);
    });
    
    it('empty project should not add category', function() {
        Project.add('', 'Test Project')
                .addCategory('test-category', 'test category');

        expect(Project.data.length).toBe(0);
    });

    it('add document should work properly', function () {
        var p = Project.add('test-project', 'Test project');
        p.addCategory('test-category', 'Test Category');
        p.addDoc('test-doc', 'Test Document', '');

        expect(Project.data[0].docs.length).toBe(1);
        expect(Project.data[0].docs[0].docId).toBe('test-doc');
        expect(Project.data[0].docs[0].docName).toBe('Test Document');
        expect(Project.data[0].docs[0].category).toBe('');
        expect(Project.data[0].docs[0].fileName).toBe('test-doc');

        p.addDoc('test-doc-cat', 'Test Document Category', 'test-category');

        expect(Project.data[0].docs.length).toBe(2);
        expect(Project.data[0].docs[1].docId).toBe('test-doc-cat');
        expect(Project.data[0].docs[1].docName).toBe('Test Document Category');
        expect(Project.data[0].docs[1].category).toBe('test-category');
        expect(Project.data[0].docs[1].fileName).toBe('test-doc-cat');
    });

    it('duplicate document id should reject', function () {
        Project.add('test-project', 'Test project')
                .addDoc('test-doc', 'Test Document', '')
                .addDoc('test-doc', 'Test Document', '');

        expect(Project.data[0].docs.length).toBe(1);
    });

    it('empty document id should reject', function () {
        Project.add('test-project', 'Test project')
                .addDoc('', 'Test Document', '');

        expect(Project.data[0].docs.length).toBe(0);
    });

    it('empty document name should reject', function () {
        Project.add('test-project', 'Test project')
                .addDoc('test-doc', '', '');

        expect(Project.data[0].docs.length).toBe(0);
    });

    it('document options should added properly', function () {
        var p = Project.add('test-project', 'Test Project');
        p.addDoc('test-doc', 'Test Document', '', {'fileName': 'test-doc-file', 'tags': 'test,doc', 'noDoc': true, 'noList': true});

        expect(Project.data[0].docs[0].fileName).toBe('test-doc-file');
        expect(Project.data[0].docs[0].tags).toBe('test,doc,document');
        expect(Project.data[0].docs[0].noDoc).toBe(true);
        expect(Project.data[0].docs[0].noList).toBe(true);
        
        p.addDoc('test-doc-2', 'Test Document', {'fileName': 'test-doc-file-2', 'tags': 'test,doc', 'noDoc': true, 'noList': true});
        
        expect(Project.data[0].docs[1].fileName).toBe('test-doc-file-2');
        expect(Project.data[0].docs[1].tags).toBe('test,doc,document');
        expect(Project.data[0].docs[1].noDoc).toBe(true);
        expect(Project.data[0].docs[1].noList).toBe(true);
        
    });

	it('other test', function() {
		Project.addNonWords();
		Project.addNonWords('');
		Project.addNonWords('a');
		Project.addNonWords(['a', 'b', 'aaa']);
		
		Project.getKeywords();
		Project.getKeywords('a b c');
		Project.getKeywords('abc abc aaa');
	});
});
