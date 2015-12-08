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

    // Project configuration.
    grunt.initConfig({
        'pkg': grunt.file.readJSON('package.json'),
        'concat': {
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
                    'src/bower_components/bootstrap/dist/js/bootstrap.min.js',
                    'src/bower_components/marked/lib/marked.js',
                    'src/bower_components/highlightjs/highlight.pack.js',
                ],
                'dest': 'dist/js/lib.min.js'
            },
            'css': {
                'src': [
                    'src/bower_components/bootstrap/dist/css/bootstrap.css',
                    'src/Content/Doc.css',
                    'src/bower_components/highlightjs/styles/github.css'
                ],
                'dest': 'dist/css/lib.css'
            }
        },
        'uglify': {
            'options': {
                'mangle': false
            },
            'dist': {
                'files': {
                    'dist/js/app.min.js': ['dist/js/app.js'],
                    //'dist/js/lib.min.js': ['dist/js/lib.js']
                }
            }
        },
        'cssmin': {
            'target': {
                'files': [
                    {expand: true, cwd: 'dist/css/', src: ['lib.css'], dest: 'dist/css/', ext: '.min.css'}
                ]
            }
        },
        'clean': {
            'minify':['dist/**/*'],
            'publish': ['publish/**/*']
        },
        'copy': {
            main: {
                files: [
                    // includes files within path
                    //{expand: true, src: ['src/*.html'], dest: 'dist/', filter: 'isFile'},
                    {expand: true, cwd: 'dist/js/', src: ['*.min.js'], dest: 'publish/js/'},
                    {expand: true, cwd: 'dist/css/', src: ['*.min.css'], dest: 'publish/css/'},
                    {expand: true, cwd: 'src/app/', src: ['**/*.html'], dest: 'publish/app/'},
                    {expand: true, cwd: 'src/data/', src: ['**/*.*'], dest: 'publish/data/'},
                    {expand: true, cwd: 'src/img/', src: ['**/*.*'], dest: 'publish/img/'},
                    {expand: true, cwd: 'src', src: ['favicon.ico'], dest: 'publish/'},
                    {expand: true, cwd: 'src', src: ['data.js'], dest: 'publish/data/'},
                    {expand: true, cwd: 'src', src: ['server.js'], dest: 'publish/'},
                    {expand: true, cwd: 'src/bower_components/bootstrap/dist/fonts', src: ['*.*'], dest: 'publish/fonts/'},
                    //{expand: true, cwd: 'dist/', src: ['*.html'], dest: 'publish/'},
                    // includes files within path and its sub-directories
                    //{expand: true, src: ['path/**'], dest: 'dest/'},
                    // makes all src relative to cwd
                    //{expand: true, cwd: 'path/', src: ['**'], dest: 'dest/'},
                    // flattens results to a single level
                    //{expand: true, flatten: true, src: ['path/**'], dest: 'dest/', filter: 'isFile'},
                ],
            },
        },
        'processhtml': {
            'dist':{
                'files':{
                    'publish/index.html': ['src/index.html']
                }
            }
        },
        'compress': {
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
        }
    });

    grunt.registerTask('minify', ['concat', 'uglify', 'cssmin']);
    grunt.registerTask('publish', ['clean', 'minify', 'processhtml', 'copy']);
    grunt.registerTask('release', ['publish', 'compress']);
};
