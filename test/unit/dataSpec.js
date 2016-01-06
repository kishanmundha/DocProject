'use strict';


describe('data service', function () {
    var a = 0;

    beforeEach(function () {
        project.data.length = 0;
    });

    it('project should add properly', function () {
        project.add('test-project', 'Test Project');

        expect(project.data.length).toBe(1);
        expect(project.data[0].projectId).toBe('test-project');
        expect(project.data[0].projectName).toBe('Test Project');
        expect(project.data[0].docs.length).toBe(0);
        expect(project.data[0].categories.length).toBe(1);
        expect(project.data[0].categories[0].name).toBe('');
        expect(project.data[0].categories[0].display).toBe('');

        project.add('test-project-2', 'Test Project 2');

        expect(project.data.length).toBe(2);
    });

    it('duplicate projectId should reject', function () {
        project.add('test-project', 'Test Project');
        project.add('test-project', 'Test Project');

        expect(project.data.length).toBe(1);
    });

    it('empty projectId should reject', function () {
        project.add('', 'Test Project');

        expect(project.data.length).toBe(0);
    });

    it('add category should work properly', function () {
        project.add('test-project', 'Test project')
                .addCategory('test-category', 'Test category');

        expect(project.data[0].categories.length).toBe(2);
        expect(project.data[0].categories[1].name).toBe('test-category');
        expect(project.data[0].categories[1].display).toBe('Test category');
    });

    it('duplicate category should reject', function () {
        project.add('test-project', 'Test project')
                .addCategory('test-category', 'Test category')
                .addCategory('test-category', 'Test category');

        expect(project.data[0].categories.length).toBe(2);
    });

    it('empty category should reject', function () {
        project.add('test-project', 'Test project')
                .addCategory('', 'Test category');

        expect(project.data[0].categories.length).toBe(1);
    });

    it('add document should work properly', function () {
        var p = project.add('test-project', 'Test project');
        p.addCategory('test-category', 'Test Category');
        p.addDoc('test-doc', 'Test Document', '');

        expect(project.data[0].docs.length).toBe(1);
        expect(project.data[0].docs[0].docId).toBe('test-doc');
        expect(project.data[0].docs[0].docName).toBe('Test Document');
        expect(project.data[0].docs[0].category).toBe('');
        expect(project.data[0].docs[0].fileName).toBe('test-doc');

        p.addDoc('test-doc-cat', 'Test Document Category', 'test-category');

        expect(project.data[0].docs.length).toBe(2);
        expect(project.data[0].docs[1].docId).toBe('test-doc-cat');
        expect(project.data[0].docs[1].docName).toBe('Test Document Category');
        expect(project.data[0].docs[1].category).toBe('test-category');
        expect(project.data[0].docs[1].fileName).toBe('test-doc-cat');
    });

    it('duplicate document id should reject', function () {
        project.add('test-project', 'Test project')
                .addDoc('test-doc', 'Test Document', '')
                .addDoc('test-doc', 'Test Document', '');

        expect(project.data[0].docs.length).toBe(1);
    });

    it('empty document id should reject', function () {
        project.add('test-project', 'Test project')
                .addDoc('', 'Test Document', '');

        expect(project.data[0].docs.length).toBe(0);
    });

    it('document options should added properly', function () {
        var p = project.add('test-project', 'Test Project');
        p.addDoc('test-doc', 'Test Document', '', {'fileName': 'test-doc-file', 'tags': 'test,doc', 'noDoc': true, 'noList': true});

        expect(project.data[0].docs[0].fileName).toBe('test-doc-file');
        expect(project.data[0].docs[0].tags).toBe('test,doc');
        expect(project.data[0].docs[0].noDoc).toBe(true);
        expect(project.data[0].docs[0].noList).toBe(true);
        
        p.addDoc('test-doc-2', 'Test Document', {'fileName': 'test-doc-file-2', 'tags': 'test,doc', 'noDoc': true, 'noList': true});
        
        expect(project.data[0].docs[1].fileName).toBe('test-doc-file-2');
        expect(project.data[0].docs[1].tags).toBe('test,doc');
        expect(project.data[0].docs[1].noDoc).toBe(true);
        expect(project.data[0].docs[1].noList).toBe(true);
        
    });
});
