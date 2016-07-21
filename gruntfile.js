module.exports = function(grunt) {
    'use strict';

    grunt.initConfig({

        jshint: { //task name
            options: { //these options apply to ALL targets
                jshintrc: '.jshintrc',
                ignores: [
                    'src/js/vendor/**'
                ]
            },
            all: { //target name  // **/* = globbing pattern
                files: { //target-specific option
                    // the files to run this on
                    src: [ 'src/js/**/*.js', 'test/specs/**/*.js', 'Gruntfile.js' ]
                }
            }
            // could have multiple targets in here...
            // each target can have its own multiple options for this task
        },

        sass: {
            all: {
                files: {
                    'build/css/styles.css': 'src/sass/main.scss'
                }
            }
        }

    });

    //loading plugins

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-sass');

    //setting up task aliases
    grunt.registerTask('build', [ 'jshint', 'sass'] );
    grunt.registerTask('default', [ 'build' ]);
};
