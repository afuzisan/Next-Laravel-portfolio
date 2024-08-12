module.exports = {
  root: true,
  parser: '@babel/eslint-parser',
  settings: {
    react: {
      version: 'detect',
    },
  },
  env: {
    node: true,
    browser: true,
    es6: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@next/next/recommended',
    'prettier',
    'plugin:react/jsx-runtime',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    requireConfigFile: false,
    sourceType: 'module',
    babelOptions: {
      presets: [['@babel/preset-react', { runtime: 'automatic' }]],
    },
  },
  rules: {
    'no-console': 'error',
    'react/react-in-jsx-scope': 'off',
    semi: ['error', 'never'],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@next/next/no-img-element': 'off',
    'react/prop-types': 'off',
  },
}
