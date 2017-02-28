module.exports = (function () {

    'use strict';

    return function (grunt) {

        // Load all the grunt tasks.
        require('load-grunt-tasks')(grunt);

        //Config Object
        var config = {
            src: 'src',                                     // working directory
            tests: 'tests',                                 // unit tests folder
            dist: 'cordova',                                // distribution folder
            supported: ['ios', 'android'],                  // supported platforms
            platform: grunt.option('platform') || 'android' // current target platform
        };

        // TODO: create the tasks
        grunt.initConfig({

            config: config,

            jshint: {
                options: {
                    jshintrc: '.jshintrc',
                    reporter: require('jshint-stylish'),
                },
                gruntfile: 'Gruntfile.js',
                src: ['<%= config.src %>/js/**/*.js', '!<%= config.src %>/js/templates.js']
            },

            // Empty the 'www' folder.
            clean: {
                options: {
                    force: true
                },
                dist: ['<%= config.dist %>/www']
            },

            // Optimize the javascript files using r.js tool.
            requirejs: {
                compile: {
                    options: {
                        baseUrl: '<%= config.src %>/js',
                        mainConfigFile: '<%= config.src %>/js/main.js',
                        almond: true,
                        include: ['main'],
                        out: '<%= config.dist %>/www/js/index.min.js',
                        optimize: 'uglify'
                    }
                }
            },

            // Optimize the CSS files.
            cssmin: {
                compile: {
                    files: {
                        '<%= config.dist %>/www/css/index.min.css': [
                            'bower_components/bootstrap/dist/css/bootstrap.css',
                            'bower_components/ratchet/dist/css/ratchet.css',
                            'bower_components/ratchet/dist/css/ratchet-theme-<%= config.platform %>.css',
                            'bower_components/components-font-awesome/css/font-awesome.css',
                            'bower_components/flag-icon-css/css/flag-icon.css',
                            '<%= config.src %>/css/app.css',
                            '<%= config.src %>/css/app.<%= config.platform %>.css'
                        ]
                    }
                }
            },

            // Change the script and css references to optimized ones.
            processhtml: {
                dist: {
                    files: {
                        '<%= config.dist %>/www/index.html': ['<%= config.src %>/index.<%= config.platform %>.html']
                    }
                }
            },

            // Copy the static resources like fonts, images to the platform specific folder.
            copy: {
                config: {
                    expand: true,
                    dot: true,
                    src: 'config.xml',
                    dest: 'cordova'
                },

                bootstrap: {
                    expand: true,
                    dot: true,
                    cwd: 'bower_components/bootstrap/dist/js',
                    dest: '<%= config.dist %>/www/js',
                    src: ['bootstrap.min.js']
                },

                ratchetFont: {
                    expand: true,
                    dot: true,
                    cwd: 'bower_components/ratchet/fonts',
                    dest: '<%= config.dist %>/www/fonts',
                    src: ['{,*/}*.*']
                },

                flagFonts: {
                    expand: true,
                    dot: true,
                    cwd: 'bower_components/flag-icon-css/flags',
                    dest: '<%= config.dist %>/www/fonts',
                    src: ['{,*/}*.*']
                },

                bootstrapFont: {
                    expand: true,
                    dot: true,
                    cwd: 'bower_components/components-font-awesome/fonts',
                    dest: '<%= config.dist %>/www/fonts',
                    src: ['{,*/}*.*']
                },

                images: {
                    expand: true,
                    dot: true,
                    cwd: '<%= config.src %>/images',
                    dest: '<%= config.dist %>/www/images',
                    src: ['{,*/}*.*']
                },

                locales: {
                    expand: true,
                    dot: true,
                    cwd: '<%= config.src %>/locales',
                    dest: '<%= config.dist %>/www/locales',
                    src: ['{,*/}*.*']
                }
            },

            handlebars: {
                compile: {
                    options: {
                        amd: true,
                        processName: function (filepath) {
                            var pieces = filepath.split('/');
                            return pieces[pieces.length - 1].split('.')[0];
                        }
                    },
                    src: ['<%= config.src %>/html/{,*/}*.handlebars'],
                    dest: '<%= config.src %>/js/templates.js'
                }
            },

            connect: {
                options: {
                    hostname: 'localhost',
                    open: true,
                    livereload: true
                },
                app: {
                    options: {
                        middleware: function (connect) {
                            return [
                                connect.static(config.src),
                                connect().use('/bower_components', connect.static('./bower_components'))
                            ];
                        },
                        port: 8081,
                        open: {
                            target: 'http://localhost:8081/index.<%= config.platform %>.html'
                        }
                    }
                }
            },

            watch: {

                // Watch grunt file.
                gruntfile: {
                    files: ['Gruntfile.js'],
                    tasks: ['jshint:gruntfile']
                },

                // Watch javascript files.
                js: {
                    files: [
                        '<%= config.src %>/js/**/*.js',
                        '!<%= config.src %>/js/templates.js'
                    ],
                    tasks: ['jshint:src'],
                    options: {
                        livereload: true
                    }
                },

                // Watch handlebar templates.
                handlebars: {
                    files: [
                        '<%= config.src %>/html/{,*/}*.handlebars'
                    ],
                    tasks: ['handlebars'],
                    options: {
                        livereload: true
                    }
                },

                // Watch html and css files.
                livereload: {
                    options: {
                        livereload: '<%= connect.options.livereload %>'
                    },
                    files: [
                        '<%= config.src %>/index.<%= config.platform %>.html',
                        '<%= config.src %>/css/app.css',
                        '<%= config.src %>/css/app.<%= config.platform %>.css'
                    ]
                }
            },

            // Task to install platforms and plugins and to build, emulate and deploy the app.
            cordovacli: {

                options: {
                    path: './<%= config.dist %>'
                },

                install: {
                    options: {
                        command: ['create', 'platform', 'plugin'],
                        platforms: '<%= config.supported %>',
                        plugins: [
                            //'camera',
                            //'file',
                            //'dialogs',
                            //'media-capture',
                            //'media-with-compression',
                            //'console'
                        ],
                        id: 'com.ipthomar.letrinhas',
                        name: 'Letrinhas'
                    }
                },

                build: {
                    options: {
                        command: 'build',
                        platforms: ['<%= config.platform %>']
                    }
                },

                emulate: {
                    options: {
                        command: 'emulate',
                        platforms: ['<%= config.platform %>']
                    }
                },

                deploy: {
                    options: {
                        command: 'run',
                        platforms: ['<%= config.platform %>']
                    }
                }
            }

        });

        // TODO: Composite Tasks
        grunt.registerTask('serve', [
            'jshint:src',
            'handlebars',
            'connect',
            'watch'
        ]);

        grunt.registerTask('create', [
            'cordovacli:install'
        ]);

        grunt.registerTask('buildweb', [
            'jshint',
            'clean',
            'handlebars',
            'requirejs',
            'cssmin',
            'processhtml',
            'copy'
        ]);

        grunt.registerTask('build', [
            'buildweb',
            'cordovacli:build'
        ]);

        grunt.registerTask('emulate', [
            'buildweb',
            'cordovacli:emulate'
        ]);

        grunt.registerTask('deploy', [
            'buildweb',
            'cordovacli:deploy'
        ]);

    };
})();
