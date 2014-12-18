'use strict'

module.exports = (grunt) ->

  require('load-grunt-tasks')(grunt)
  require('time-grunt')(grunt)

  grunt.initConfig

    jade:
      html:
        options:
          pretty: true
        files: [
          expand: true
          flatten: true
          cwd: 'jade/html'
          src: [
            '{,*/}*.jade'
          ]
          dest: '.'
          ext: '.html'
        ]

    sass:
      dist:
        options:
          style: 'expanded'
          compass: false
          noCache: true
          update: false
          unixNewlines: true
          trace: true
          sourcemap: 'none'
        files: [
          expand: true
          # flatten: false
          cwd: 'sass'
          src: ['./*.sass']
          dest: 'css'
          ext: '.css'
        ]

    autoprefixer:
      options:
        browsers: ['last 1 version']
      files:
        expand: true
        # flatten: true
        cwd: 'css'
        src: ['./*.css']
        dest: 'css'
        ext: '.css'

    concurrent:
      dev: [
        'jade'
        'sass'
      ]

    watch:

      sass:
        files: ['sass/**/*.sass']
        tasks: ['sass', 'autoprefixer']

      jade:
        files: ['jade/html/{,*/}*.jade']
        tasks: ['jade']

    browserSync:
      dev:
        bsFiles:
          src: 'css/*.css'
        options:
          notify: true
          watchTask: true
          port: 8284
          server:
            baseDir: './'


  grunt.registerTask 'default', [
    'concurrent:dev'
    'autoprefixer'
  ]

  grunt.registerTask 'server', [
    'default'
    'browserSync:dev'
    'watch'
  ]

  return
