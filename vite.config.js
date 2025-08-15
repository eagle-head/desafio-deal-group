/// <reference types="vitest" />
import { defineConfig } from 'vite';
import { coverageConfigDefaults } from 'vitest/config';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'clover', 'json'],
      // Include only src directory for coverage
      include: ['src/**/*.{js,jsx,ts,tsx}'],
      exclude: [
        // Extend default exclude patterns (recommended by Vitest docs)
        ...coverageConfigDefaults.exclude,
        // Project-specific exclusions
        'src/main.jsx', // Entry point
        '**/constants.{js,jsx,ts,tsx}', // Constants files
        '**/index.{js,jsx,ts,tsx}', // Barrel files
        'src/test/**', // Test setup files
      ],
      // Thresholds temporarily disabled until more tests are added
      // Re-enable these thresholds as you add more tests to enforce quality gates
      thresholds: {
        global: {
          statements: 0,
          branches: 0,
          functions: 0,
          lines: 0,
        },
      },
      reportsDirectory: './coverage',
      clean: true,
      skipFull: false,
    },
    testTimeout: 10000,
    hookTimeout: 10000,
  },
});
