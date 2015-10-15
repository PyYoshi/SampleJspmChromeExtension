module.exports = function(grunt) {
    require('jit-grunt')(grunt, {
        replace: 'grunt-text-replace'
    });

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        meta: {
            releaseDirectory: '',
            buildVersion: ''
        },

        babel: {
            options: {
                modules: 'system',
                sourceMap: true
            },
            compiled: {
                files: [{
                    expand: true,
                    cwd: 'src',
                    src: [
                        '**/*.js',
                        '!**/main.js',
                        '!**/lib/**',
                    ],
                    dest: 'compiled'
                }]
            }
        },

        copy: {
            options: {
                mtimeUpdate: true,
                timestamp: true
            },
            compiled: {
                expand: true,
                cwd: 'src/',
                src: [
                    '**/*',
                    'css/*',
                    '!**/background/**',
                    '!**/common/**',
                    '!**/content_scripts/**',
                    '!**/options/**',
                    '!**/popup/**',
                    '!**/test/**',
                    '**/main.js'
                ],
                dest: 'compiled/'
            }
        },

        jscs: {
            src: [
                'src/js/**/*.js',
                '!src/js/lib/**/*.js'
            ],
            options: {
                config: '.jscsrc',
                verbose: true,
                fix: true
            }
        },

        jshint: {
            options: {
                'node': true,
                'esnext': true,
                'bitwise': false,
                'curly': false,
                'eqeqeq': true,
                'eqnull': true,
                'immed': true,
                'latedef': true,
                'newcap': true,
                'noarg': true,
                'undef': true,
                'strict': false,
                'predef': [
                    'chrome',
                    'System',
                ]
            },
            files: [
                'src/js/**/*.js',
                '!src/js/lib/**/*.js'
            ]
        },

        mocha: {
            tests: {
                options: {
                    log: true,
                    logErrors: true,
                    run: false,
                    inject: '',
                    urls: ['http://localhost:8888/test.html']
                }
            }
        },

        watch: {
            copyCompiled: {
                options: {
                    event: ['added', 'changed'],
                    cwd: 'src/js'
                },
                files: [
                    'background/**/*',
                    'common/**/*',
                    'content_scripts/**/*',
                    'options/**/*',
                    'popup/**/*',
                    'test/**/*',
                    '!**/main.js'
                ],
                tasks: ['newer:babel:compiled']
            },

            copyUncompiled: {
                options: {
                    event: ['added', 'changed'],
                    cwd: 'src'
                },
                files: [
                    '**/*',
                    'css/*',
                    '!**/background/**',
                    '!**/common/**',
                    '!**/content_scripts/**',
                    '!**/options/**',
                    '!**/popup/**',
                    '!**/test/**',
                    '**/main.js'
                ],
                tasks: ['newer:copy:compiled']
            },

            js: {
                files: [
                    'src/js/**/*.js',
                    '!src/js/lib/**/*.js'
                ],
                tasks: [
                    // 'jscs',
                    'jshint'
                ]
            }

        },

    });

    grunt.registerTask('compile', ['copy:compiled', 'babel:compiled', 'watch']);
};
