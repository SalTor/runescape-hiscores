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
                    'build/app/index.min.js': [
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
                    'build/server/api.min.js': ['build/.tmp/server/api.min.js'],
                    'build/server/routes/player.js': [
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
        clean: {
            build: {
                src: ["./build/.tmp"]
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
                    {'build/index.css' : 'development/scss/index.scss'}
                ]
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
                tasks: ['sass', 'notify'],
                cacheLocation: false,
                options : {
                    livereload: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-notify');
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('base',    ['babel', 'uglify:angular', 'sass', 'notify', 'clean']);
    grunt.registerTask('default', ['base', 'watch']);
    grunt.registerTask('build',   ['base']);
};
