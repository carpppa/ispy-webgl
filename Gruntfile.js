module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    // Metadata.
    meta: {
      srcPath: 'views/templates/',
      deployPath: 'views/'
    },

    jst: {
      compile: {
        options: {
          //namespace: "anotherNameThanJST",      //Default: 'JST'
          prettify: false,                        //Default: false|true
          amdWrapper: false,                      //Default: false|true
          templateSettings: {
            escape : /\{\{-(.+?)\}\}/g,           // {{- }}
            evaluate: /\{\{(.+?)\}\}/g,           // {{  }} HOX! Wrap every line of code between these! Newlines are not allowed.
            interpolate : /\{\{=(.+?)\}\}/g       // {{= }}
          },
          processName: function(filename) {
            //Shortens the file path for the template.
            return filename.slice(filename.indexOf('views/templates/') + String('views/templates/').length, filename.indexOf('.html'));
          }
        },
        files: {
          '<%= meta.deployPath %>template.js': ['<%= meta.srcPath %>*.html']
        }
      }
    }

  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jst');

  // Default task
  grunt.registerTask('default', ['jst']);

};
