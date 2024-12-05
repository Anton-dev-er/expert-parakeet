import React from 'react';
import { render, screen } from '@testing-library/react';
import PublicRooms from '@/src/pages/Home/PublicRooms/PublicRooms';
import { mockRooms } from '@/__tests__/mock';

describe('PublicRooms', () => {
  test('renders heading', async () => {
    render(<PublicRooms rooms={[]} />);
    const heading = screen.getByRole('heading', { level: 2 });

    expect(heading).toBeInTheDocument();
  });

  test('rooms not found', async () => {
    const { getByText } = render(<PublicRooms rooms={[]} />);
    const heading = getByText('Rooms not found');

    expect(heading).toBeInTheDocument();
  });

  test('rooms found', async () => {
    const { queryByText } = render(<PublicRooms rooms={mockRooms} />);
    const heading = queryByText('Rooms not found');

    expect(heading).not.toBeInTheDocument();
  });
});
