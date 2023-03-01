import React from 'react'
import { getByText, render, screen, waitFor } from '@testing-library/react'
import App from './App'
import fetchMock from "jest-fetch-mock"

import randomUserOne from './testData/randomUserOne.json'
import { act } from 'react-dom/test-utils'

fetchMock.enableMocks();

// Ensures each test will have a clean historical slate, meaning they do not run in any particular order
beforeEach(() => {
  window.localStorage.clear()
  fetchMock.resetMocks()
})

test('renders basic Candidate Review app header and loading screen', () => {
  render(<App />)

  const candidateHeaderElement = screen.getByText(/Candidate Review Page/i)
  expect(candidateHeaderElement).toBeInTheDocument()

  // In the real world when API is not available we'd want to show an error page with suggested actions
  const loadingMessageElement = screen.getByText(/Loading/i)
  expect(loadingMessageElement).toBeInTheDocument()
});

test('candidate info is displayed, user can leave comments and approve', async () => {
  console.log(randomUserOne)
  fetchMock.mockResponse(JSON.stringify(randomUserOne))

  await act(() => {
    render(<App />)
  })

  await waitFor(() => {
    const candidateHeaderElement = screen.getByText(/Candidate Review Page/i)
    expect(candidateHeaderElement).toBeInTheDocument()
  })

})
