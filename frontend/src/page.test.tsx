import { render, screen } from '@testing-library/react';
import HomePage from './page';

describe('HomePage', () => {
  it('renders the main heading', () => {
    render(<HomePage />);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Full-Stack AI Boilerplate');
  });

  it('renders the description', () => {
    render(<HomePage />);

    const description = screen.getByText(/Clean, production-ready starter/i);
    expect(description).toBeInTheDocument();
  });
});