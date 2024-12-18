import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import { expect, test } from 'vitest'
import IndexPage from '../pages/index.astro'
import Page404 from '../pages/404.astro'
import CliPage from '../pages/cli.astro'
import ActixPage from '../pages/actix.astro'
import ProtectedPage from '../pages/auth/protected.astro'
import AstroPage from '../pages/astro.astro'
// @eslint-disable-next-line import/no-unresolved
// @ts-expect-error wrong types, but this combo works
import ssr from '@astrojs/svelte/server.js'
import ssrReact from '@astrojs/react/server.js'
test('Index Page', async () => {
  const container = await AstroContainer.create()
  const result = await container.renderToString(IndexPage)
  expect(result).toContain('🦀 Rust orientated monolithic')
})

test('404 Page', async () => {
  const container = await AstroContainer.create()
  const result = await container.renderToString(Page404)
  expect(result).toContain('404')
})

test('Cli Page', async () => {
  const container = await AstroContainer.create()
  const result = await container.renderToString(CliPage)
  expect(result).toContain('AstroX Cli')
})

test('Actix Page', async () => {
  const container = await AstroContainer.create()
  const result = await container.renderToString(ActixPage)
  expect(result).toContain('ActiX')
})

test('Astro Page', async () => {
  const container = await AstroContainer.create()
  container.addServerRenderer({
    name: '@astrojs/svelte',
    // @ts-expect-error wrong types, but this combo works
    renderer: ssr
  })
  container.addClientRenderer({
    name: '@astrojs/svelte',
    entrypoint: '@astrojs/svelte/client-v5.js'
  })

  container.addServerRenderer({
    name: '@astrojs/react',
    renderer: ssrReact
  })
  container.addClientRenderer({
    name: '@astrojs/react',
    entrypoint: '@astrojs/react/client-v17.js'
  })

  const result = await container.renderToString(AstroPage)
  expect(result).toContain('Astro framework frontend')
})

test('Protected Page', async () => {
  const container = await AstroContainer.create()
  const result = await container.renderToString(ProtectedPage)
  expect(result).toContain('Protected')
})
