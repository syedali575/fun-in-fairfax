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
            src: "**/*.html",
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
          },
          {  expand: true,
            cwd: "node_modules/angular-ui-router/release/",
            src: ["angular-ui-router.js"],
            dest: "build/js"
          }
        ]

      },
    // End of copy
    },

    concat: {
      js: {
        src: ["src/js/fairfax.module.js", "src/js/**/*.js"],
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
    watch:{
      js: {
        files: ["src/**/*.js"],
        tasks: ["js-build"]
      },
      sass:{
        files:["src/**/*.scss"],
        tasks:["css-build"]
      },
      html:{
        files:["src/**/*.html"],
        tasks:["copy:html"]
      },

      test:{
        files: ["test/specs/**/*.js"],
        tasks: ["test"]
      }
    },

    karma:{
      options: {
        frameworks: ["mocha", "chai"],
        client: {
          mocha: {
            ui: "bdd"
          }
        },
        browsers: ["PhantomJS"],
        singleRun: true,

        preprocessors: {
          "src/js/**/*.js": ["coverage"]
        },
        reporters: ["dots", "coverage"],
        coverageReporter: {
          type: "text-summary"
        }
      },
      fairfax:{
        options:{
          files: [
            "node_modules/angular/angular.js",
            "node_modules/angular-ui-router/release/angular-ui-router.js",
            "node_modules/angular-mocks/angular-mocks.js",
            "src/js/fairfax.module.js",
            "src/js/parks.controller.js",
            "src/js/parks.service.js",
            "test/specs/parks.service.spec.js",
            "test/specs/parks.controller.spec.js"
          ]
        }
      }

    }

  // End of Config
  });

  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-sass");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-connect");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-karma");



  grunt.registerTask('test', ['connect', "karma"]);

  grunt.registerTask('js-build', ["concat:js", "jshint"]);
  grunt.registerTask('css-build', ["sass"]);


  grunt.registerTask("default", ["clean", "jshint", "sass", "copy", "concat"]);
// End of module
};
