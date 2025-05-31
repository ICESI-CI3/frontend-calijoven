const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  testPathIgnorePatterns: ['<rootDir>/e2e/', '<rootDir>/.next/', '<rootDir>/node_modules/'],
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/*.test.{js,jsx,ts,tsx}',
    '!src/**/index.{js,jsx,ts,tsx}',
    // Excluir archivos de configuración y constantes
    '!src/lib/constants/**',
    '!src/types/**',
    // Excluir archivos de Next.js
    '!src/app/**',
    '!src/app/(dashboard)/**',
    '!src/app/(general)/**',
    // Excluir componentes de UI reutilizables
    '!src/components/layout/**',
    '!src/components/Carousel/**',
    '!src/components/RichTextEditor/**',
    '!src/components/Attachment/**',
    '!src/lib/api/**',
    // '!src/modules/*/services/**',
    // Excluir archivos de configuración y utilidades
    '!src/lib/helpers/**',
    '!src/lib/hooks/**',
    // Excluir componentes de formularios que deberían probarse en pruebas de integración
    '!src/modules/*/components/*Form/**',
  ],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig); 