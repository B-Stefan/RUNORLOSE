exports.config =
  minMimosaVersion:'1.0.0'

  modules: [
    'server'
    'require'
    'minify'
    'live-reload'
    'combine'
    'requirebuild-include'
    'requirebuild-textplugin-include'
    'bower'
    'lint'
  ]
  watch:
    javascriptDir: 'javascripts/app'

  requireBuildTextPluginInclude:
    pluginPath: 'text'
    extensions: ['html']

  requireBuildInclude:
    folder:"javascripts"
    patterns: ['app/**/*.js']


  server:
    defaultServer:
      enabled: true
      onePager: false
    views:
      compileWith: 'html'
      extension: 'html'

  require:
    optimize:
      overrides:
        name: '../vendor/almond-custom'
        inlineText: true
        stubModules: ['text']
        pragmas:
          build: true