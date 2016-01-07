"use strict";

module.exports = function(config){
  config.set({

    basePath : '../',

    files : [
      'src/bower_components/angular/angular.js',
      'src/bower_components/angular-route/angular-route.js',
      //'src/bower_components/angular-resource/angular-resource.js',
      'src/bower_components/angular-animate/angular-animate.js',
      'src/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
      'src/bower_components/angular-mocks/angular-mocks.js',
      'src/bower_components/angular-sanitize/angular-sanitize.min.js',
      'src/bower_components/marked/lib/marked.js',
      'src/app/**/*.js',
      'src/config.js',
      //'test/unit/**/*.js'
      'test/unit/controllersSpec.js',
      'test/unit/servicesSpec.js',
      'test/unit/dataSpec.js'
      //'test/unit/appCtrlSpec.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : [
        'Chrome'//,
        //'Firefox'
    ],

    plugins : [
            'karma-chrome-launcher',
            //'karma-firefox-launcher',
            'karma-jasmine',
            'karma-jasmine-html-reporter'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    },
    reporters : ['progress', 'html']

  });
};