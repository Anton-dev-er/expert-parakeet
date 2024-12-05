import React from 'react';
import { render, screen } from '@testing-library/react';
import Hero from '@/src/pages/Home/Hero/Hero';

describe('Hero', () => {
  test('renders heading', async () => {
    render(<Hero />);
    const heading = screen.getByRole('heading', { level: 1 })

    expect(heading).toBeInTheDocument()
  });
});