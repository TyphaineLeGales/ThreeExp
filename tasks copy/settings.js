module.exports = {
  paths: {
    distDir: __dirname + '/../docs',
    html: __dirname + '/../docs/index.html',
    jsSrc: __dirname + '/../src/index.js',
    jsRelDist: 'assets/js/index.js'
  },
  transforms: [

    // glslify-hex needs to add in the package in order to get this work :/
    ['glslify'],

    ['stringify', { appliesTo: { includeExtensions: ['.glsl', 'tmpl'] } }],

    ['babelify', { presets: ['es2015'] }]
  ]
};
