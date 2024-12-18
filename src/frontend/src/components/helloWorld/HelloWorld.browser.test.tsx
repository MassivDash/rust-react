/**
 * @vitest-environment jsdom
 */

import { HelloWorld } from './helloWorld.tsx'
import { expect, test, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'

vi.mock('@axios/axiosBackendInstance', () => ({
  axiosBackendInstance: {
    get: vi.fn(() => Promise.resolve({ data: { message: 'Hello, World!' } }))
  }
}))

test('Testing library react test, using rtl render and axios mock up', async () => {
  render(<HelloWorld />)
  // Check if the loading text is displayed initially
  expect(screen.getByText('fetching /hello')).toBeTruthy()

  // Wait for the data to be fetched and displayed
  await waitFor(() => {
    expect(screen.getByText('Hello, World!')).toBeTruthy()
  })
})
