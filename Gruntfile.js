/* jshint node: true */

module.exports = function(grunt) {
  "use strict";

  var semver = require("semver");
  var btoa = require('btoa');

  // Project configuration.
  grunt.initConfig({

    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*!\n' +
              ' * Bootstrap v<%= pkg.version %> by @fat and @mdo\n' +
              ' * Copyright <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
              ' * Licensed under <%= _.pluck(pkg.licenses, "url").join(", ") %>\n' +
              ' *\n' +
              ' * Designed and built with all the love in the world by @mdo and @fat.\n' +
              ' */\n\n',
    jqueryCheckBefore: '(function (factory) {\n\n' +
                        'if (typeof define === "function" && define.amd) {\n\n' +
                        'define(["jquery"], function(jQuery){\n\n' +
                        '  factory(jQuery);\n\n' +
                        '  return jQuery;\n\n' +
                        '});\n\n' +
                        '} else { factory(window.jQuery); }\n\n' +
                        '}(function (jQuery) {\n\n',
    jqueryCheckAfter: '}));',

    // Task configuration.
    clean: {
      dist: ['dist'],
      gudstrap: ['gudstrap']
    },

    jshint: {
      options: {
        jshintrc: 'js/.jshintrc'
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      src: {
        src: ['js/*.js']
      },
      test: {
        src: ['js/tests/unit/*.js']
      }
    },

    concat: {
      options: {
        banner: '<%= banner %><%= jqueryCheckBefore %>',
        footer: '<%= jqueryCheckAfter%>',
        stripBanners: false
      },
      bootstrap: {
        src: [
          'js/transition.js',
          'js/alert.js',
          'js/button.js',
          'js/carousel.js',
          'js/collapse.js',
          'js/dropdown.js',
          'js/modal.js',
          'js/tooltip.js',
          'js/popover.js',
          'js/scrollspy.js',
          'js/tab.js',
          'js/affix.js',
          'js/toggle-btn-group-ef.js',
          'js/stepper-ef.js'
        ],
        dest: 'dist/js/<%= pkg.name %>.js'
      }
    },
    
    uglify: {
      options: {
        banner: '<%= banner %>',
        report: 'min'
      },
      bootstrap: {
        src: ['<%= concat.bootstrap.dest %>'],
        dest: 'dist/js/<%= pkg.name %>.min.js'
      }
    },

    recess: {
      options: {
        compile: true,
        banner: '<%= banner %>'
      },
      bootstrap: {
        src: ['less/bootstrap-ef.less'],
        dest: 'dist/css/<%= pkg.name %>.css'
      },
      min: {
        options: {
          compress: true
        },
        src: ['less/bootstrap-ef.less'],
        dest: 'dist/css/<%= pkg.name %>.min.css'
      },
      theme: {
        src: ['less/theme.less'],
        dest: 'dist/css/<%= pkg.name %>-theme.css'
      },
      theme_min: {
        options: {
          compress: true
        },
        src: ['less/theme.less'],
        dest: 'dist/css/<%= pkg.name %>-theme.min.css'
      },
      docs: {
        src: ['docs-assets/less/docs-ef.less'],
        dest: 'docs-assets/css/docs-ef.css'
      }
    },

    copy: {
      fonts: {
        expand: true,
        flatten: true,
        src: [ "fonts/*", "bower_components/fontawesome/font/*" ],
        dest: 'dist/fonts'
      },
      docscss: {
        expand: true,
        flatten: true,
        src: [ 'docs-assets/css/docs.css' ],
        dest: 'docs-assets/less/',
        ext: '.less'
      },
      gudstrap: {
        expand: true,
        cwd: 'dist/',
        src: [ '**/*' ],
        dest: 'gudstrap/<%= pkg["version-gudstrap"] %>/'
      }
    },

    qunit: {
      options: {
        inject: 'js/tests/unit/phantom.js'
      },
      files: ['js/tests/*.html']
    },

    connect: {
      server: {
        options: {
          port: 3000,
          base: '.'
        }
      }
    },

    jekyll: {
      docs: {}
    },

    validation: {
      options: {
        reset: true,
        relaxerror: [
            "Bad value X-UA-Compatible for attribute http-equiv on element meta.",
            "Element img is missing required attribute src."
        ]
      },
      files: {
        src: [
          "_gh_pages/**/*.html",
          "!_gh_pages/bower_components/**/*"
        ]
      }
    },

    watch: {
      src: {
        files: '<%= jshint.src.src %>',
        tasks: ['jshint:src', 'qunit']
      },
      test: {
        files: '<%= jshint.test.src %>',
        tasks: ['jshint:test', 'qunit']
      },
      recess: {
        files: 'less/*.less',
        tasks: ['recess']
      }
    },

    bumpup: {
        options: {
          updateProps: {
            pkg: 'package.json'
          }
        },
        setters: {
          "version": function (oldVersion, releaseType, options) {
            return oldVersion;
          },
          "version-gudstrap": function (oldVersion, releaseType, options) {
            return semver.inc(oldVersion, releaseType);
          }
        },
        files: ['package.json', 'bower.json']
    }

  });


  // Load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // Docs HTML validation task
  grunt.registerTask('validate-html', ['jekyll', 'validation']);

  // Test task.
  var testSubtasks = ['dist-css', 'jshint', 'qunit', 'validate-html'];
  // Only run BrowserStack tests under Travis
  if (process.env.TRAVIS) {
    // Only run BrowserStack tests if this is a mainline commit in twbs/bootstrap, or you have your own BrowserStack key
    if ((process.env.TRAVIS_REPO_SLUG === 'twbs/bootstrap' && process.env.TRAVIS_PULL_REQUEST === 'false') || process.env.TWBS_HAVE_OWN_BROWSERSTACK_KEY) {
      testSubtasks.push('browserstack_runner');
    }
  }
  grunt.registerTask('test', testSubtasks);

  // JS distribution task.
  grunt.registerTask('dist-js', ['concat', 'uglify']);

  // CSS distribution task.
  grunt.registerTask('dist-css', ['copy:docscss', 'recess']);

  // Fonts distribution task.
  grunt.registerTask('dist-fonts', ['copy:fonts']);

  // Full distribution task.
  grunt.registerTask('dist', ['clean:dist', 'dist-css', 'dist-fonts', 'dist-js']);

  // Default task.
  grunt.registerTask('default', ['test', 'dist']);

  // Copy for GudStrap with version.
  grunt.registerTask('dist-gudstrap', ['clean:gudstrap', 'copy:gudstrap']);

  // Default task.
  grunt.registerTask('gudstrap', function (type) {
    if (type !== null && type !== false){
      // Bumpup version, depends on "semver"
      grunt.task.run('bumpup:' + type);
    }
    grunt.task.run('default');
    // Create version control for gudstrap
    grunt.task.run('dist-gudstrap');
  });

  // task for building customizer
  grunt.registerTask('build-customizer', 'Add scripts/less files to customizer.', function () {
    var fs = require('fs')

    function getFiles(type) {
      var files = {}
      fs.readdirSync(type)
        .filter(function (path) {
          return type == 'fonts' ? true : new RegExp('\\.' + type + '$').test(path)
        })
        .forEach(function (path) {
          var fullPath = type + '/' + path
          return files[path] = (type == 'fonts' ? btoa(fs.readFileSync(fullPath)) : fs.readFileSync(fullPath, 'utf8'))
        })
      return 'var __' + type + ' = ' + JSON.stringify(files) + '\n'
    }

    var files = getFiles('js') + getFiles('less') + getFiles('fonts')
    fs.writeFileSync('docs-assets/js/raw-files.js', files)
  });
};
