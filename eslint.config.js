
import importHelpers from 'eslint-plugin-import-helpers';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import js from '@eslint/js';

export default [
  // Garante que o ESLint ignora pastas geradas e ele próprio
  {
    ignores: ['eslint.config.js', 'dist/**', 'node_modules/**'],
  },
  
  // Regras padrão do JavaScript
  js.configs.recommended,
  
  // Regras da nossa aplicação Vite + React
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'import-helpers': importHelpers,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      // Organização automática dos imports no topo dos ficheiros
      'import-helpers/order-imports': [
        'warn',
        {
          newlinesBetween: 'always',
          groups: [
            '/^node:/',
            'module',
            '/^@//',
            ['parent', 'sibling', 'index'],
          ],
          alphabetize: { order: 'asc', ignoreCase: true },
        },
      ],
    },
  },
  
  // O Prettier deve ser sempre a última configuração da lista
  eslintPluginPrettierRecommended,
];
