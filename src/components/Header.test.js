import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from './Header';

describe('Header Component', () => {
  test('renders title correctly', () => {
    render(<Header title="Test Title" />);
    const titleElement = screen.getByText(/Test Title/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('renders subtitle when provided', () => {
    render(<Header title="Test Title" subtitle="Test Subtitle" />);
    const subtitleElement = screen.getByText(/Test Subtitle/i);
    expect(subtitleElement).toBeInTheDocument();
  });

  test('does not render subtitle when not provided', () => {
    render(<Header title="Test Title" />);
    const subtitleElements = screen.queryByText(/subtitle/i);
    expect(subtitleElements).not.toBeInTheDocument();
  });
});
