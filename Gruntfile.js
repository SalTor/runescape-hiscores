module.exports = function(grunt){
    grunt.initConfig({
        server_config: grunt.file.readJSON('grunt-ssh.json'),
        babel: {
            options: {
                sourceMap: true,
                presets: ['babel-preset-es2015']
            },
            dist: {
                files: {
                    'public/build/.tmp/app/index.min.js': 'source/js/app/index.js'
                }
            }
        },
        rsync: {
            options: {
                args: ["--verbose"],
                exclude: [".git*","*.scss","node_modules"],
                recursive: true
            },
            production: {
                options: {
                    src: [
                        "./public/build/css/"
                    ],
                    host: "<%= server_config.user %>@<%= server_config.host %>",
                    dest: "<%= server_config.dest %>"
                }
            }
        },
        uglify: {
            release: {
                files: {
                    'public/build/js/app/index.min.js': [
                        './node_modules/lodash/lodash.min.js',
                        './node_modules/jquery/dist/jquery.min.js',
                        './node_modules/bootstrap/dist/js/bootstrap.min.js',
                        './node_modules/angular/angular.min.js',
                        './node_modules/angular-animate/angular-animate.min.js',
                        './node_modules/angular-route/angular-route.min.js',
                        'public/build/.tmp/app/index.min.js'
                    ]
                },
                options: {
                    mangle: false,
                    enclose: {},
                    compress: {
                        drop_console: true,
                        unused: true,
                        warnings: true
                    }
                }
            }
        },
        notify: {
            build: {
                options: {
                    title: 'RuneScape HiScores App',
                    message: 'Files have been updated'
                }
            },
            release: {
                options: {
                    title: 'RuneScape HiScores App',
                    message: 'Files have been deployed'
                }
            }
        },
        sass: {
            hiscores : {
                options : {
                    style : 'expanded',
                    update : true,
                    trace: true,
                    loadPath: require('node-bourbon').includePaths
                },
                files : [
                    {'public/build/css/index.css' : 'source/scss/index.scss'}
                ]
            }
        },
        browserSync: {
            dev: {
                bsFiles: {
                    src: [
                        './public/index.html',
                        './public/build/js/app/index.min.js',
                        './public/build/css/index.css'
                    ]
                },
                options: {
                    watchTask: true,
                    server: './public'
                }
            }
        },
        concat: {
            options: { separator: ';' },
            dist: {
                src: [
                    'public/build/.tmp/app/libraries.min.js',
                    'public/build/.tmp/app/index.min.js'
                ],
                dest: 'public/build/js/app/index.min.js',
            },
            libraries: {
                src: [
                    './node_modules/lodash/lodash.min.js',
                    './node_modules/jquery/dist/jquery.min.js',
                    './node_modules/bootstrap/dist/js/bootstrap.min.js',
                    './node_modules/angular/angular.min.js',
                    './node_modules/angular-animate/angular-animate.min.js',
                    './node_modules/angular-route/angular-route.min.js'
                ],
                dest: 'public/build/.tmp/app/libraries.min.js',
            }
        },
        postcss: {
            options: {
                map: true,
                processors: [
                    require('autoprefixer')({browsers: ['last 4 versions']})
                ]
            },
            dist: {
                src: './public/build/css/index.css'
            }
        },
        watch: {
            angular_app: {
                files: ['source/js/app/**/*.js', 'source/js/app/*.js'],
                tasks: ['babel', 'concat:dist', 'notify:build'],
                options : {
                    livereload: true
                }
            },
            sass: {
                files: ['source/scss/index.scss', 'source/scss/**/*.scss'],
                tasks: ['sass', 'notify:build'],
                cacheLocation: false,
                options : {
                    livereload: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-notify');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-browser-sync');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-rsync');
    grunt.loadNpmTasks('grunt-contrib-concat')

    grunt.registerTask('default', ['dev']);

    grunt.registerTask('dev', ['babel', 'concat:libraries', 'concat:dist', 'sass', 'browserSync', 'watch', 'notify:build']);
    grunt.registerTask('server-release', ['babel', 'uglify:release'])
    grunt.registerTask('release', ['sass', 'postcss', 'rsync', 'notify:release']);
};
