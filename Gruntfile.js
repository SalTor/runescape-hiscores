module.exports = function(grunt){
    grunt.initConfig({
        babel: {
            options: {
                sourceMap: true,
                presets: ['babel-preset-es2015']
            },
            angular: {
                files: {
                    'build/.tmp/app/index.min.js': 'development/javascript/app/index.js'
                }
            },
            server: {
                files: {
                    'build/server/api.min.js': 'development/javascript/server/api.js',
                    'build/server/routes/player.js': 'development/javascript/server/routes/player.js'
                }
            }
        },
        uglify: {
            angular: {
                files: {
                    'build/app/index.min.js': [
                        './node_modules/jquery/dist/jquery.min.js',
                        './node_modules/bootstrap/dist/javascript/bootstrap.min.js',
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
                    'build/server/routes/player.js': ['build/.tmp/server/routes/player.js']
                }
            }
        },
        postcss: {
            options: {
                map: true,
                processors: [
                    require('autoprefixer')({
                        browsers: ['last 2 versions']
                    })
                ]
            },
            dist: {src: 'build/index.css'}
        },
        notify: {
            build: {
                options: {
                    title: '',
                    message: 'Grunt tasks finished'
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
                    {'build/index.css' : 'development/sassy-css/index.scss'}
                ]
            }
        },
        watch: {
            server: {
                files: ['development/javascript/server/*.js', 'development/javascript/server/**/*.js'],
                tasks: ['babel:server', 'notify', 'clean']
            },
            angular_app: {
                files: ['development/javascript/app/**/*.js', 'development/javascript/app/*.js'],
                tasks: ['babel:angular', 'uglify:angular', 'notify', 'clean'],
                options : {
                    livereload: true
                }
            },
            sass: {
                files: ['development/sassy-css/index.scss', 'development/sassy-css/**/*.scss'],
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

    grunt.registerTask('base',    ['babel', 'uglify:angular', 'sass', 'postcss', 'notify', 'clean']);
    grunt.registerTask('default', ['base', 'watch']);
    grunt.registerTask('build',   ['base']);
};
