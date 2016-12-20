"use strict";

module.exports = function(grunt){

  grunt.initConfig({

    clean:["build"],

    jshint:{
      options: {
        jshintrc: ".jshintrc",
        ignore: ["node_modules/**"]
      },
      source: {
        files: {
          src: ["src/js/**/*.js"]
        }
      },
      test: {
        files: {
          src: ["test/specs/**/*.js"]
        }
      }
    //End of jshint
    },

    sass: {
      allStyles: {
        files: {
          "build/css/styles.css": "src/sass/main.scss"
        }
      }
    // End of sass
    },

    copy:{
      html:{
        files: [
          {
            expand: true,
            cwd: "src/",
            src: "index.html",
            dest: "build/"
          }
        ]
      },

      img: {
        files: [
          {
            expand: true,
            cwd: "src/",
            src: "img/**/*.*",
            dest: "build"
          }
        ]
      },

      vendorjs:{
        files: [
          {
            expand: true,
            cwd: "node_modules/angular/",
            src: ["angular.js"],
            dest: "build/js"
          }
        ]
      },
    // End of copy
    },

    concat: {
      js: {
        src: ["src/js/**/*.js"],
        dest: "build/js/app.js"
      }
    },

    connect:{
      testing: {
        options: {
          port: 8888,
          base: "."
        }
      }
    },





  // End of Config
  });

  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-sass");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-connect");



  grunt.registerTask("default", ["clean", "jshint", "sass", "copy", "concat"]);
// End of module
};
