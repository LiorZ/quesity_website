module.exports = function(grunt) {
  grunt.initConfig({
    meta: {
      banner: '/*! /Quesity website build <%= pkg.version %> - <%= pkg.homepage %> */'
    },
    recess: {
      dist: {
        src: [
          'components/bootstrap/less/bootstrap.less',
          'components/bootstrap/less/responsive.less',
          'public/css/less/app.less'
        ],
        dest: 'public/css/main.css',
        options: {
          compile: true
        }
      }
    },
    concat: {
      js: {
        src: [
          'components/jquery/jquery.min.js',
          'components/modernizr/modernizr.js'
        ],
        dest: 'public/js/scripts.js'
      }
    },
    watch: {
      files: ['public/css/less/*.less', 'public/css/less/bootstrap/*.less'],
      tasks: 'default'
    }
  });

  grunt.registerTask('default', 'recess concat');
  grunt.loadNpmTasks('grunt-contrib');
  grunt.loadNpmTasks('grunt-recess');
};
