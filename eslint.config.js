import js from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import prettier from 'eslint-plugin-prettier';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
  // 기본 JavaScript 설정
  js.configs.recommended,

  // TypeScript 설정
  ...tseslint.configs.recommended,

  // React 설정
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      prettier,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2020,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      // JavaScript/TypeScript 규칙
      'no-unused-vars': 'off',
      'prefer-const': 'error',
      'no-var': 'error',
      'no-duplicate-imports': 'error',
      semi: ['error', 'always'],
      indent: ['error', 2],
      'no-debugger': 'error',
      'import/prefer-default-export': 'off',

      // TypeScript 규칙
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'off', //일단 off로 꺼두었음!!!!!!!
      '@typescript-eslint/explicit-function-return-type': 'off', // 필요에 따라 'warn' 또는 'error'로 변경

      // React 규칙
      'react/jsx-no-useless-fragment': 'error',
      'react/jsx-boolean-value': ['error', 'never'],
      'react/self-closing-comp': 'error',
      'react/button-has-type': 'error',

      // React Hooks 규칙
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // React Refresh 규칙
      'react-refresh/only-export-components': 'warn',

      // Prettier 규칙
      'prettier/prettier': 'error',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  prettierConfig,

  // 테스트 파일 제외 (선택사항)
  {
    files: ['**/*.test.{js,jsx,ts,tsx}', '**/*.spec.{js,jsx,ts,tsx}'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
];
