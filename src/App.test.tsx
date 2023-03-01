import React from 'react'
import { findAllByRole, fireEvent, getAllByRole, queryByAttribute, render, RenderResult, screen, waitFor } from '@testing-library/react'
import App from './App'
import fetchMock from "jest-fetch-mock"
import { act } from 'react-dom/test-utils'

import randomUserOne from './testData/randomUserOne.json'
import randomUserTwo from './testData/randomUserTwo.json'

fetchMock.enableMocks();
const getById = queryByAttribute.bind(null, 'id');

const typeMessage = (dom: RenderResult, message: string) => {
  const candidateMessageInputElement = getById(dom.container, 'candidateMessageInput')!
  fireEvent.change(candidateMessageInputElement, {target: {value: message}})
}

const clickButton = (buttonId: string) => (dom: RenderResult) => {
  const buttonElement = getById(dom.container, buttonId)!
  fireEvent.click(buttonElement)
}
// Partial function application is one of my favorite tools for code reuse
const approveClick = clickButton('approveButton')
const rejectClick = clickButton('rejectButton')

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
    typeMessage(dom, 'Rostislava is an excellent candidate.')
    approveClick(dom)
  })

  await waitFor(async () => {
    //Input box should clear when "new" candidate is loaded, but message should appear in history view below
    const candidateMessageInputElement = getById(dom.container, 'candidateMessageInput')!
    expect (candidateMessageInputElement).toHaveTextContent('')

    //Cells should be populated with the right info
    const gridCells = await findAllByRole(dom.container, "cell");
    const undoButton = gridCells[0].querySelector('button')

    expect(undoButton).toBeInTheDocument()
    expect(gridCells[1]).toHaveTextContent('Erstenyuk, RostislavaUkrainerostislava.erstenyuk@example.com')
    expect(gridCells[2]).toHaveTextContent('Approve')
    expect(gridCells[3]).toHaveTextContent('Rostislava is an excellent candidate.')
  })

})

test('user can leave comments and reject', async () => {
  fetchMock.mockResponse(JSON.stringify(randomUserTwo))
  let dom: RenderResult

  await act(() => {
    dom = render(<App />)
  })

  await waitFor(() => {
    const candidateFullNameElement = getById(dom.container, 'candidateFullName')
    expect(candidateFullNameElement).toBeInTheDocument()
  })

  await act(() => {
    typeMessage(dom, 'Jeannine was not a good fit.')
    rejectClick(dom)
  })

  await waitFor(async () => {
    //Input box should clear when "new" candidate is loaded, but message should appear in history view below
    const candidateMessageInputElement = getById(dom.container, 'candidateMessageInput')!
    expect (candidateMessageInputElement).toHaveTextContent('')

    //Cells should be populated with the right info
    const gridCells = await findAllByRole(dom.container, "cell");
    const undoButton = gridCells[0].querySelector('button')

    expect(undoButton).toBeInTheDocument()
    expect(gridCells[1]).toHaveTextContent('Zacharias, JeannineGermanyjeannine.zacharias@example.com')
    expect(gridCells[2]).toHaveTextContent('Reject')
    expect(gridCells[3]).toHaveTextContent('Jeannine was not a good fit.')
  })

})
