module.exports = function(grunt){
    grunt.initConfig({
        babel: {
            options: {
                sourceMap: true,
                presets: ['babel-preset-es2015']
            },
            angular: {
                files: {
                    'build/.tmp/app/index.min.js': 'development/js/app/index.js'
                }
            },
            server: {
                files: {
                    'build/.tmp/server/api.min.js': 'development/js/server/api.js',
                    'build/.tmp/server/routes/player.js': 'development/js/server/routes/player.js'
                }
            }
        },
        uglify: {
            angular: {
                files: {
                    'build/js/app/index.min.js': [
                        './node_modules/jquery/dist/jquery.min.js',
                        './node_modules/bootstrap/dist/js/bootstrap.min.js',
                        './node_modules/angular/angular.min.js',
                        './node_modules/angular-animate/angular-animate.min.js',
                        './node_modules/angular-route/angular-route.min.js',
                        'build/.tmp/app/index.min.js'
                    ]
                }
            },
            server: {
                files: {
                    'build/js/server/api.min.js': ['build/.tmp/server/api.min.js'],
                    'build/js/server/routes/player.js': [
                        './node_modules/array-find-polyfill/index.js',
                        'build/.tmp/server/routes/player.js'
                    ]
                },
                options: {
                    sourceMap: true
                }
            }
        },
        notify: {
            build: {
                options: {
                    title: 'RuneScape Hiscores App',
                    message: 'Files have been updated'
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
                    {'build/css/index.css' : 'development/scss/index.scss'}
                ]
            }
        },
        browserSync: {
            dev: {
                bsFiles: {
                    src: [
                        './index.html',
                        './build/js/app/index.min.js',
                        './build/css/index.css'
                    ]
                },
                options: {
                    watchTask: true,
                    server: '.'
                }
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
                src: './build/css/index.css'
            }
        },
        watch: {
            server: {
                files: ['development/js/server/*.js', 'development/js/server/**/*.js'],
                tasks: ['babel:server', 'uglify:server', 'notify']
            },
            angular_app: {
                files: ['development/js/app/**/*.js', 'development/js/app/*.js'],
                tasks: ['babel:angular', 'uglify:angular', 'notify'],
                options : {
                    livereload: true
                }
            },
            sass: {
                files: ['development/scss/index.scss', 'development/scss/**/*.scss'],
                tasks: ['sass', 'postcss', 'notify'],
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

    grunt.registerTask('base',    ['babel', 'uglify', 'sass', 'postcss', 'notify']);
    grunt.registerTask('default', ['base', 'browserSync', 'watch']);
    grunt.registerTask('build',   ['base']);
};
