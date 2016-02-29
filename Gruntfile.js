module.exports = function(grunt){
    grunt.initConfig({
        babel: {
            options: {
                sourceMap: true,
                presets: ['babel-preset-es2015']
            },
            dist: {
                files: {
                    'Build/index-babel.js': 'Development/scripts/index.js'
                }
            }
        },
        uglify: {
            babel: {
                files: {
                    'Build/index.min.js': ['Build/index-babel.js']
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
        watch: {
            babel: {
                files: ['Development/scripts/index.js'],
                tasks: ['babel', 'uglify']
            },
            sass: {
                files: ['Development/scss/index.scss', 'Development/scss/**/*.scss'],
                tasks: ['sass']
            }
        }
    });
     
    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('default', ['babel', 'uglify', 'sass', 'watch']);
};