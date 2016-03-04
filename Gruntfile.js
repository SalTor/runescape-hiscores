module.exports = function(grunt){
    grunt.initConfig({
        babel: {
            options: {
                sourceMap: true,
                presets: ['babel-preset-es2015']
            },
            dist: {
                files: {
                    'Build/babel-index.min.js': 'Development/scripts/index.js',
                    'Build/babel-api.min.js': 'Development/scripts/api.js'
                }
            }
        },
        uglify: {
            babel: {
                files: {
                    'Build/babel-index.min.js': ['Build/babel-index.min.js'],
                    'Build/babel-api.min.js':   ['Build/babel-api.min.js']
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

    grunt.registerTask('build', ['base']);
    grunt.registerTask('base', ['babel', 'uglify', 'sass']);
    grunt.registerTask('default', ['base', 'watch']);
};