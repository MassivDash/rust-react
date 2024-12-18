import { getViteConfig } from 'astro/config'

export default getViteConfig({
  test: {
    globals: true,
    setupFiles: './setup.vitest.ts',
    coverage: {
      extension: ['.astro', '.ts', '.tsx', '.svelte'],
      provider: 'v8',
      reporter: ['text', 'json-summary', 'json', 'cobertura']
    }
  }
})
