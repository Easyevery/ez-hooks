module.exports = {
  extends: ['eslint:recommended', 'prettier'],
  parser: '@typescript-eslint/parser',
  root: true,
  rules: {
    '@typescript-eslint/no-explicit-any': 'warn',
  },
};
