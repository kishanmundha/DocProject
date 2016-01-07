(function (window) {
    "use strict";

    var data = [];

    /**
     * @public
     * @type Class
     * @description Project constructor
     * @param {String} projectId
     * @param {String} projectName
     * @returns {Object} Project instance
     */
    var Project = function (projectId, projectName) {

        var ERROR_DUPLICATE_CATEGORY = 'Duplicate category not allowed';
        var ERROR_EMPTY_PROJECT_ID = 'Empty ProjectId not allowed';
        var ERROR_EMPTY_PROJECT_NAME = 'Empty Project Name not allowed';
        var ERROR_DUPLICATE_PROJECT_ID = 'Duplicate Project ID not allowed';
        var ERROR_EMPTY_DOC_ID = 'Empty Document Id not allowed';
        var ERROR_EMPTY_DOC_NAME = 'Empty Document Name not allowed';
        var ERROR_DUPLICATE_DOC_ID = 'Duplicate Document ID not allowed';

        var projectData = {'categories': [], 'docs': []};

        /**
         * @public
         * @description Add a category
         * @param {String} name
         * @param {String} displayText
         * @returns {Object} return instance of project
         */
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

        /***
         * @public
         * @description Add document mapping
         * @param {String} docId
         * @param {String} docName
         * @param {String} category (if this field is object then
         *  category will set empty and options replace by this)
         * @param {Object} options
         * @returns {Object} return instance of project
         */
        var addDoc = function (docId, docName, category, options) {
            if (projectData.projectId) {

                if (Object.prototype.toString.call(category) === '[object Object]') {
                    options = category;
                    category = '';
                }

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

                    doc.fileName = options.fileName || docId;
                    doc.tags = options.tags || '';
                    doc.noDoc = options.noDoc || false;
                    doc.noList = options.noList || false;

                    projectData.docs.push(doc);

                }
                catch (ex) {
                    console.error(ex);
                }
            }

            return this;
        };

        // validate and add project
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

    /**
     * @public
     * @description Add project to list
     * @param {String} projectId
     * @param {String} projectName
     * @returns {Object} Instance of project
     */
    Project.add = function (projectId, projectName) {
        return new Project(projectId, projectName);
    };

    Project.data = data;
    window.Project = Project;
    window.data = data;

})(window);

