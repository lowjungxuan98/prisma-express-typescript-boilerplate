import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import prettierPlugin from 'eslint-plugin-prettier';

export default [
  {
    // Ignore patterns (replacing .eslintignore)
    ignores: ['node_modules/**', 'bin/**', 'build/**']
  },
  {
    // Global config for all files
    languageOptions: {
      parser: typescriptParser,
      ecmaVersion: 2018,
      sourceType: 'module',
      parserOptions: {
        project: './tsconfig.json'
      }
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin,
      'prettier': prettierPlugin
    },
    rules: {
      ...typescriptPlugin.configs.recommended.rules,
      ...prettierPlugin.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'off'
    }
  }
]; 