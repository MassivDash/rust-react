import { svelteTesting } from '@testing-library/svelte/vite'
import react from '@vitejs/plugin-react'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { defineWorkspace } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

// defineWorkspace provides a nice type hinting DX
export default defineWorkspace([
  {
    // add "extends" to merge two configs together
    plugins: [react(), svelte(), svelteTesting(), tsconfigPaths()],
    test: {
      include: ['**/*.browser.test.{ts,tsx,jsx}'],
      // it is recommended to define a name when using inline configs
      name: 'ASTRO CLIENT',
      environment: 'js-dom'
    }
  },
  {
    extends: './vitest.config.ts',
    test: {
      include: ['**/!(*.browser).test.{ts,js,tsx,jsx,astro}'],
      name: 'Astro SSR',
      environment: 'node'
    }
  }
])
