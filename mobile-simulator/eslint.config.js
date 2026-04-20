import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),

  // Browser-scoped app code (src/, excluding server + tests)
  {
    files: ['src/**/*.{js,jsx}'],
    ignores: ['src/__tests__/**/*'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', {
        varsIgnorePattern: '^[A-Z_]',
        argsIgnorePattern: '^(_|Icon$)',
        destructuredArrayIgnorePattern: '^_',
      }],
      // Context files intentionally export both the Provider component and hooks/context
      // — fast-refresh rule doesn't apply here.
      'react-refresh/only-export-components': 'off',
      // react-hooks v7 purity rule flags Date.now / Math.random in handlers incorrectly
      // for this demo project. Downgrade so it surfaces only in real-use editor tooling.
      'react-hooks/purity': 'off',
    },
  },

  // Node-scoped: server + config files
  {
    files: ['server.js', '*.config.js'],
    extends: [js.configs.recommended],
    languageOptions: {
      ecmaVersion: 2020,
      globals: { ...globals.node },
      parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
    },
  },

  // Test-scoped: Vitest globals + browser (jsdom)
  {
    files: ['src/__tests__/**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.node,
        describe: 'readonly',
        test: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        beforeAll: 'readonly',
        afterEach: 'readonly',
        afterAll: 'readonly',
        vi: 'readonly',
      },
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['warn', { varsIgnorePattern: '^[A-Z_]' }],
      // Test files use harness-reassigned refs and Node-globals fixtures that
      // react-hooks v7 purity rules flag as false positives. Disable for tests.
      'react-hooks/purity': 'off',
      'react-hooks/globals': 'off',
      'react-hooks/set-state-in-effect': 'off',
    },
  },
])
