import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  window.localStorage.clear()
})

test('renders basic Candidate Review header', () => {
  render(<App />);
  const candidateHeaderElement = screen.getByText(/Candidate Review Page/i);
  expect(candidateHeaderElement).toBeInTheDocument();
});
