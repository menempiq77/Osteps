import coreWebVitals from 'eslint-config-next/core-web-vitals';
import typescript from 'eslint-config-next/typescript';

export default [
  ...coreWebVitals,
  ...typescript,
  {
    ignores: [
      '**/.next/**',
      '**/Osteps/**',
      '**/out/**',
      '**/build/**',
      '**/next-env.d.ts',
      '**/node_modules/**',
      '.data/**',
      'postman/**',
      'public/**',
      'scripts/**',
      'test-results/**',
      'textbooks/**',
      'tmp/**',
    ],
  },
];
