(function () {
    'use strict';

    var app = angular.module('app');

    app.constant('config', {
        debugEnabled: true, // log enabled
        enableEditDoc: true,
        enableDocSave: false,
        editDoc: {
            autoLocalSave: false,
            autoSaveDuration: 1000 * 10,   // 10 seconds
            autoSaveExpiry: 1000 * 60 * 60    // 1 hour
            // allow to guest
        },
        apiServiceBaseUri: '/api/',
        isLoginEnable: function() {
            return this.enableEditDoc;
        }
        // authentication: {
        // enabled
        // login api
        // logout api
        // allow as guest
        // sub version control password stroe on local, runtime, server
        // git api
        // }
        
        /*
         * 1. Who can edit page -- no one, anomys, authenticated user
         *      a. auto save to cache
         *      b. save duration
         *      c. save expiry
         * 2. What is the process of save doc
         *      a. anomys -- git username and password ask every time
         *      b. authenticated user
         *          i. password ask every time
         *          ii. password store on browser cache
         *          iii. password store on server db
         * 
         * > if editing feature was disabled then no need to configure authentication
         * > if auto save disabled then no need to configure duration and expiry
         * > 
         * > authentication type -> node.js, mvc web api owin ( sample code )
         */
    });
})();