/**
 * @vitest-environment jsdom
 */

import { render, screen, waitFor } from '@testing-library/svelte'
import { expect, test, vi } from 'vitest'
import SpaceX from './spacex.svelte'

// Mock the axiosBackendInstance
vi.mock('@axios/axiosBackendInstance', () => ({
  axiosBackendInstance: {
    get: vi.fn(() =>
      Promise.resolve({
        data: [
          {
            id: 1,
            rocket_id: 'falcon1',
            rocket_name: 'Falcon 1',
            rocket_type: 'rocket'
          }
        ]
      })
    )
  }
}))

test('fetches and displays SpaceX data', async () => {
  // Mock the response from axios

  render(SpaceX)

  // Check if the loading text is displayed initially
  expect(
    screen.getByText('Svelte Component (Client side call example)')
  ).toBeTruthy()

  // Wait for the data to be fetched and displayed
  await waitFor(() => {
    expect(screen.getByText('Falcon 1')).toBeTruthy()
  })
})
