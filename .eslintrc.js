module.exports = {
  env: {
    browser: true,
    es2021: true,
    mocha: true,
    node: true,
  },
  extends: ['standard', 'prettier', 'plugin:node/recommended'],
  rules: {
    'node/no-unsupported-features/es-syntax': [
      'error',
      { ignores: ['modules'] },
    ],
    'node/no-unpublished-require': ['warn', { allowModules: [] }],
    'node/no-unpublished-import': ['warn'],
    'node/no-missing-import': ['warn'],
    'no-lone-blocks': ['off'],
    'no-unused-vars': ['warn'],
  },
  settings: {
    node: { tryExtensions: ['.js', '.json', '.node'] },
  },
  parserOptions: {
    sourceType: 'module',
  },
};
