module.exports = function(grunt){
    grunt.initConfig({
        babel: {
            options: {
                sourceMap: true,
                presets: ['babel-preset-es2015']
            },
            dist: {
                files: {
                    'Build/index.min.js': 'Development/scripts/index.js',
                    'Build/api.min.js': 'Development/scripts/api.js',
                    'Build/routes/player.js': 'Development/scripts/routes/player.js'
                }
            }
        },
        uglify: {
            babel: {
                files: {
                    'Build/index.min.js': ['Build/index.min.js'],
                    'Build/api.min.js':   ['Build/api.min.js'],
                    'Build/routes/player.js': ['Build/routes/player.js']
                }
            }
        },
        sass : {
            hiscores : {
                options : {
                    style : 'compressed',
                    update : true,
                    trace: true,
                    loadPath: require('node-bourbon').includePaths
                },
                files : [
                    {'Build/index.css' : 'Development/scss/index.scss'}
                ]
            }
        },
        notify: {
            build: {
                options: {
                    title: '',
                    message: 'Grunt tasks finished'
                }
            }
        },
        watch: {
            babel: {
                files: ['Development/scripts/*.js', 'Development/scripts/routes/*.js'],
                tasks: ['babel', 'notify']
            },
            sass: {
                files: ['Development/scss/index.scss', 'Development/scss/**/*.scss'],
                tasks: ['sass', 'notify']
            }
        }
    });

    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-notify');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('base', ['babel', 'sass', 'notify']);
    grunt.registerTask('default', ['base']);
    grunt.registerTask('runescape', ['base', 'watch']);
};