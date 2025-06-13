import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingSpinner from './LoadingSpinner';

describe('LoadingSpinner Component', () => {
  test('renders with default text', () => {
    render(<LoadingSpinner />);
    const loadingText = screen.getByText(/Loading.../i);
    expect(loadingText).toBeInTheDocument();
  });

  test('renders with custom text', () => {
    render(<LoadingSpinner text="Custom loading text" />);
    const loadingText = screen.getByText(/Custom loading text/i);
    expect(loadingText).toBeInTheDocument();
  });

  test('spinner element is rendered', () => {
    render(<LoadingSpinner />);
    // Since the spinner is a styled div without text or role, 
    // we can test that the container element is present
    const spinnerContainer = screen.getByTestId('spinner-container');
    expect(spinnerContainer).toBeInTheDocument();
  });
});
