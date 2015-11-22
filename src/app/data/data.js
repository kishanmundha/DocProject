(function (window) {

    var data = [];

    var project = function (projectId, projectName) {

        var ERROR_DUPLICATE_CATEGORY = 'Duplicate category not allowed';
        var ERROR_EMPTY_PROJECT_ID = 'Empty ProjectId not allowed';
        var ERROR_EMPTY_PROJECT_NAME = 'Empty Project Name not allowed';
        var ERROR_DUPLICATE_PROJECT_ID = 'Duplicate Project ID not allowed';
        var ERROR_EMPTY_DOC_ID = 'Empty Document Id not allowed';
        var ERROR_EMPTY_DOC_NAME = 'Empty Document Name not allowed';
        var ERROR_DUPLICATE_DOC_ID = 'Duplicate Document ID not allowed';

        var projectData = {'categories': [], 'docs': []};

        var addCategory = function (name, displayText) {
            if (projectData.projectId) {
                try {

                    var existsdata = projectData.categories.filter(function (item) {
                        return item.name === name;
                    });

                    if (existsdata.length)
                        throw ERROR_DUPLICATE_CATEGORY;

                    var category = {};
                    category.name = name;
                    category.display = displayText;

                    projectData.categories.push(category);
                }
                catch (ex) {
                    console.error(ex);
                }
            }

            return this;
        };

        var addDoc = function (docId, docName, category, options) {
            if (projectData.projectId) {

                try {

                    if (!docId)
                        throw ERROR_EMPTY_DOC_ID;

                    if (!docName)
                        throw ERROR_EMPTY_DOC_NAME;

                    var existsdata = projectData.docs.filter(function (item) {
                        return item.docId === docId;
                    });

                    if (existsdata.length)
                        throw ERROR_DUPLICATE_DOC_ID;

                    options = options || {};
                    var doc = {};
                    doc.docId = docId;
                    doc.docName = docName;
                    doc.category = category || '';

                    doc.fileName = options.fileName;
                    doc.tags = options.tags;
                    doc.noDoc = options.noDoc;

                    projectData.docs.push(doc);

                }
                catch (ex) {
                    console.error(ex);
                }
            }

            return this;
        };

        (function () {
            try {
                if (!projectId)
                    throw ERROR_EMPTY_PROJECT_ID;

                if (!projectName)
                    throw ERROR_EMPTY_PROJECT_NAME;

                var existsdata = data.filter(function (item) {
                    return item.projectId === projectId;
                });

                if (existsdata.length)
                    throw ERROR_DUPLICATE_PROJECT_ID;

                projectData.projectId = projectId;
                projectData.projectName = projectName;

                data.push(projectData);

                addCategory('', '');
            }
            catch (ex) {
                console.error(ex);
            }
        })();

        this.addCategory = addCategory;
        this.addDoc = addDoc;
    };

    project.add = function (projectId, projectName) {
        return new project(projectId, projectName);
    };

    window.project = project;
    window.data = data;

})(window);

