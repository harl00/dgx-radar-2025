import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock the components that use D3 to avoid the D3 import issues
jest.mock('./components/RadarChart', () => {
  return function MockRadarChart() {
    return <div data-testid="radar-chart">Radar Chart Mock</div>;
  };
});

jest.mock('./services/DataService', () => ({
  fetchData: jest.fn().mockResolvedValue([]),
  getRings: jest.fn().mockReturnValue([]),
  getQuadrants: jest.fn().mockReturnValue([]),
}));

describe('App Component', () => {
  test('renders header with title', () => {
    render(<App />);
    const headerElement = screen.getByText(/Technology Radar Visualization/i);
    expect(headerElement).toBeInTheDocument();
  });

  test('renders loading spinner initially', () => {
    render(<App />);
    const loadingElement = screen.getByText(/Loading radar data/i);
    expect(loadingElement).toBeInTheDocument();
  });
});
