import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import { expect, test } from 'vitest'
// @eslint-disable-next-line import/no-unresolved
import ssr from '@astrojs/react/server.js'

import { HelloWorld } from './helloWorld.tsx'
import type { AstroComponentFactory } from 'astro/runtime/server/index.js'

test('React Astro Island Container test', async () => {
  const container = await AstroContainer.create()
  container.addServerRenderer({
    name: '@astrojs/react',
    renderer: ssr
  })
  container.addClientRenderer({
    name: '@astrojs/react',
    entrypoint: '@astrojs/react/client-v17.js'
  })
  const result = await container.renderToString(
    HelloWorld as unknown as AstroComponentFactory
  ) // This works but astro still have not pinned down the types correctly
  expect(result).toContain('React Island')
  expect(result).toContain('fetching /hello')
})
