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
          trace: false
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
        cwd: 'css'
        src: ['*.css', '!*.min.css', '!*.con.css']
        dest: 'css'
        ext: '.css'

    csso:
      dynamic_mappings:
        expand: true
        cwd: 'css'
        src: ['*.css', '!*.min.css']
        dest: 'css'
        ext: '.min.css'

    concurrent:
      dev: [
        'jade'
        'sass'
      ]

    watch:
      sass:
        files: ['sass/**/*.sass']
        tasks: ['sass', 'autoprefixer', 'csso', 'shell:cssc']

      jade:
        files: ['jade/html/{,*/}*.jade']
        tasks: ['jade']

    browserSync:
      dev:
        bsFiles:
          src: 'css/*.con.css'
        options:
          notify: true
          watchTask: true
          port: 8284
          server:
            baseDir: './'

    shell:
      cssc:
        command: [
          'node_modules/css-condense/bin/cssc css/app.min.css > css/app.con.css'
        ].join ';'


  grunt.registerTask 'default', [
    'concurrent:dev'
    'autoprefixer'
    'csso'
    'shell:cssc'
  ]

  grunt.registerTask 'server', [
    'default'
    'browserSync:dev'
    'watch'
  ]

  return
