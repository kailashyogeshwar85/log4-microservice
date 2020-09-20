module.exports = {
  tags: {
    allowUnknownTags: true,
    dictionaries: ['jsdoc'],
  },
  source: {
    include: ['mlogger.js', 'typedefs.js', 'adapters', 'factory', 'README.md'],
    includePattern: '.js$',
    exclude: ['node_modules', '.gitignore', '.git', 'test', 'examples', 'docs', 'jsdoc.config.js', 'doctemplate'],
  },
  plugins: [
    'plugins/markdown',
    'node_modules/jsdoc-typeof-plugin',
  ],
  sourceType: 'module',
  recurseDepth: 10,
  templates: {
    disableSort: false,
    referenceTitle: 'Log4-Microservice Reference v1.0.0',
    collapse: true,
  },
  opts: {
    destination: 'docs',
    encoding: 'utf8',
    private: true,
    recurse: true,
    readme: 'README.md',
    // "template": "./node_modules/tsd-jsdoc/dist" // for creating typedefinitions
    template: 'template/braintree',
  },
};
