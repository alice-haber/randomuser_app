import React from 'react'
import { getByText, queryByAttribute, render, RenderResult, screen, waitFor } from '@testing-library/react'
import App from './App'
import fetchMock from "jest-fetch-mock"

import randomUserOne from './testData/randomUserOne.json'
import { act } from 'react-dom/test-utils'

fetchMock.enableMocks();
const getById = queryByAttribute.bind(null, 'id');

// Ensures each test will have a clean historical slate, meaning they do not run in any particular order
beforeEach(() => {
  window.localStorage.clear()
  fetchMock.resetMocks()
})

test('renders basic Candidate Review app header and loading screen when API not available', () => {
  render(<App />)

  const candidateHeaderElement = screen.getByText(/Candidate Review Page/i)
  expect(candidateHeaderElement).toBeInTheDocument()

  // In the real world when API is not available we'd want to show an error page with suggested actions
  const loadingMessageElement = screen.getByText(/Loading/i)
  expect(loadingMessageElement).toBeInTheDocument()
});

test('candidate info is displayed, user can leave comments and approve', async () => {
  fetchMock.mockResponse(JSON.stringify(randomUserOne))
  let dom: RenderResult

  await act(() => {
    dom = render(<App />)
  })

  await waitFor(() => {
    const candidateHeaderElement = screen.getByText(/Candidate Review Page/i)
    expect(candidateHeaderElement).toBeInTheDocument()

    const candidateFullNameElement = getById(dom.container, 'candidateFullName')
    const candidateCountryElement = getById(dom.container, 'candidateCountry')
    const candidatePostcodeElement = getById(dom.container, 'candidatePostcode')
    const candidateEmailElement = getById(dom.container, 'candidateEmail')
    const candidatPhoneElement = getById(dom.container, 'candidatePhone')
    const candidatCellElement = getById(dom.container, 'candidateCell')

    expect(candidateFullNameElement).toHaveTextContent('Erstenyuk, Rostislava')
    expect(candidateCountryElement).toHaveTextContent('Ukraine')
    expect(candidatePostcodeElement).toHaveTextContent('17916')
    expect(candidateEmailElement).toHaveTextContent('rostislava.erstenyuk@example.com')
    expect(candidatPhoneElement).toHaveTextContent('(098) T86-4161')
    expect(candidatCellElement).toHaveTextContent('(096) S94-6027')
  })

  await act(() => {

  })

  await waitFor(() => {
    
  })

})
