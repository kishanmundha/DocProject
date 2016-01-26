"use strict";

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-processhtml');
    grunt.loadNpmTasks('grunt-html2js');

    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-protractor-runner');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    // Project configuration.
    grunt.initConfig({
        'pkg': grunt.file.readJSON('package.json'),
        concat: {
            'dist1': {
                'src': ['src/app/**/*.js'],
                'dest': 'dist/js/app.js'
            },
            'dist2': {
                'src': [
                    'src/bower_components/jquery/dist/jquery.min.js',
                    'src/bower_components/angular/angular.min.js',
                    'src/bower_components/angular-route/angular-route.min.js',
                    'src/bower_components/angular-sanitize/angular-sanitize.min.js',
                    'src/bower_components/angular-animate/angular-animate.min.js',
                    'src/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
                    'src/bower_components/bootstrap/dist/js/bootstrap.min.js',
                    'src/bower_components/marked/lib/marked.js',
                    'src/bower_components/highlightjs/highlight.pack.js',
                ],
                'dest': 'dist/js/lib.min.js'
            },
            'css': {
                'src': [
                    'src/bower_components/bootstrap/dist/css/bootstrap.css',
                    'src/bower_components/bootstrap/dist/css/bootstrap-theme.css',
                    'src/Content/bootstrap-extend.css',
                    'src/Content/bootstrap-theme-extend.css',
                    'src/Content/Doc.css',
                    'src/bower_components/highlightjs/styles/github.css'
                ],
                'dest': 'dist/css/lib.css'
            },
            build: {
                'bin/debug/js/app.js': ['src/app/**/*.js'],
                //'bin/debug/js/lib.js': [],
                'bin/debug/js/lib.min.js': [
                    'src/bower_components/jquery/dist/jquery.min.js',
                    'src/bower_components/angular/angular.min.js',
                    'src/bower_components/angular-route/angular-route.min.js',
                    'src/bower_components/angular-sanitize/angular-sanitize.min.js',
                    'src/bower_components/angular-animate/angular-animate.min.js',
                    'src/bower_components/bootstrap/dist/js/bootstrap.min.js',
                    'src/bower_components/marked/lib/marked.js',
                    'src/bower_components/highlightjs/highlight.pack.js',
                ],
                'dist/css/lib.css': [
                    'src/bower_components/bootstrap/dist/css/bootstrap.css',
                    'src/Content/Doc.css',
                    'src/bower_components/highlightjs/styles/github.css'
                ]
            }
        },
        uglify: {
            'options': {
                'mangle': true,
				'sourceMap': true
            },
            'dist': {
                'files': {
                    'dist/js/app.min.js': ['dist/js/app.js'],
                    //'dist/js/lib.min.js': ['dist/js/lib.js']
                    'dist/js/template.min.js': ['dist/js/template.js'],
                }
            }
        },
        cssmin: {
            'target': {
                'files': [
                    {expand: true, cwd: 'dist/css/', src: ['lib.css'], dest: 'dist/css/', ext: '.min.css'}
                ]
            }
        },
        clean: {
            'minify': ['dist/**/*'],
            'publish': ['publish/**/*'],
            'build': ['bin/debug/**/*'],
            'release': ['bin/release/**/*']
        },
        copy: {
            main: {
                files: [
                    // includes files within path
                    //{expand: true, src: ['src/*.html'], dest: 'dist/', filter: 'isFile'},
                    {expand: true, cwd: 'dist/js/', src: ['*.*'], dest: 'publish/js/'},
                    {expand: true, cwd: 'dist/css/', src: ['*.*'], dest: 'publish/css/'},
                    //{expand: true, cwd: 'src/app/', src: ['**/*.html'], dest: 'publish/app/'},
                    {expand: true, cwd: 'src/data/', src: ['**/*.*'], dest: 'publish/data/'},
                    {expand: true, cwd: 'src/img/', src: ['**/*.*'], dest: 'publish/img/'},
                    {expand: true, cwd: 'src', src: ['favicon.ico'], dest: 'publish/'},
                    {expand: true, cwd: 'src', src: ['data.js'], dest: 'publish/data/'},
                    {expand: true, cwd: 'src', src: ['server.js'], dest: 'publish/'},
                    {expand: true, cwd: 'src', src: ['config.js'], dest: 'publish/'},
                    {expand: true, cwd: 'src/bower_components/bootstrap/dist/fonts', src: ['*.*'], dest: 'publish/fonts/'},
                    //{expand: true, cwd: 'dist/', src: ['*.html'], dest: 'publish/'},
                    // includes files within path and its sub-directories
                    //{expand: true, src: ['path/**'], dest: 'dest/'},
                    // makes all src relative to cwd
                    //{expand: true, cwd: 'path/', src: ['**'], dest: 'dest/'},
                    // flattens results to a single level
                    //{expand: true, flatten: true, src: ['path/**'], dest: 'dest/', filter: 'isFile'},
                ]
            },
            build: {
                files: [
                    {expand: true, cwd: 'src/data/', src: ['**/*.*'], dest: 'bin/debug/data/'},
                    {expand: true, cwd: 'src/img/', src: ['**/*.*'], dest: 'bin/debug/img/'},
                    {expand: true, cwd: 'src', src: ['favicon.ico'], dest: 'bin/debug/'},
                    {expand: true, cwd: 'src', src: ['data.js'], dest: 'bin/debug/data/'},
                    {expand: true, cwd: 'src', src: ['server.js'], dest: 'bin/debug/'},
                    {expand: true, cwd: 'src', src: ['config.js'], dest: 'bin/debug/'},
                    {expand: true, cwd: 'src/bower_components/bootstrap/dist/fonts', src: ['*.*'], dest: 'bin/debug/fonts/'},
                ]
            }
        },
        processhtml: {
            'dist': {
                'files': {
                    'publish/index.html': ['src/index.html']
                }
            }
        },
        compress: {
            'main': {
                'options': {
                    //'archive': 'release/<%= pkg.name %>-<%= pkg.version %>.zip',
                    'archive': 'release/<%= pkg.name %>-<%= pkg.version %>.zip'
                            //'mode': 'gzip'
                },
                'files': [
                    {expand: true, cwd: 'publish/', src: ['**/*'], dest: ''}
                ]
            }
        },
        html2js: {
            options: {
                base: 'src',
                module: 'app',
                singleModule: true,
                useStrict: true,
                existingModule: true,
                htmlmin: {
                    collapseBooleanAttributes: true,
                    collapseWhitespace: true,
                    removeAttributeQuotes: true,
                    removeComments: true,
                    removeEmptyAttributes: true,
                    removeRedundantAttributes: true,
                    removeScriptTypeAttributes: true,
                    removeStyleLinkTypeAttributes: true
                },
                rename: function (moduleName) {
                    return '/' + moduleName;
                }
            },
            main: {
                src: ['src/app/**/*.html'],
                dest: 'dist/js/template.js'
            }
        },
        karma: {
            unit: {
                configFile: 'test/karma.conf.js',
                singleRun: true,
				browsers:['PhantomJS']
            },
			debug: {
                configFile: 'test/karma.conf.js',
                //singleRun: true,
			}
        },
        protractor: {
            /*options: {
             configFile: "test/protractor-conf.js", // Default config file
             keepAlive: true, // If false, the grunt process stops when the test fails.
             noColor: false, // If true, protractor will not use colors in its output.
             args: {
             // Arguments passed to the command
             }
             },*/
            all: {// Grunt requires at least one target to run so you can simply put 'all: {}' here too.
                options: {
                    configFile: "test/protractor-conf.js", // Target-specific config file
                    keepAlive: true, // If false, the grunt process stops when the test fails.
                    noColor: false, // If true, protractor will not use colors in its output.
                    args: {} // Target-specific arguments
                }
            }
        },
        jshint: {
            all: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
            options: {
                jshintrc: true,
                //ignores: ['src/bower_components/**/*.js']
            }
        }
    });

    grunt.registerTask('clean:all', ['clean:build', 'clean:release']);
    grunt.registerTask('test', ['jshint', 'karma:unit']);
	grunt.registerTask('test:full', ['jshint', 'karma', 'protractor']);

    grunt.registerTask('minify', ['concat', 'html2js', 'uglify', 'cssmin']);
    grunt.registerTask('publish', ['minify', 'processhtml', 'copy']);
    grunt.registerTask('release', ['publish', 'compress']);

    grunt.registerTask('build:debug', ['concat', 'html2js', 'copy:build']);
    grunt.registerTask('build:release', ['clean:all', 'build', 'test', 'uglify', 'cssmin', 'processhtml', 'copy:release']);
    grunt.registerTask('release', ['build:release', 'compress']);

    /*
     src folder use css - less
     src folder use orignal files
     
     build folder use css - concat
     js concat
     html concat
     everything was concat
     envierment development
     
     in debug we run build code
     
     release folder use minify all build
     
     in run we run release code
     */
	 
	grunt.registerTask('gruntTest', 'Grunt test', function() {
		grunt.log.writeln('Currently running the "Grunt test" task.');
		
		grunt.task.run('test', 'minify');
	});
};
