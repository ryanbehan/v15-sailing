import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PartCard from '../src/components/PartCard';

const part = {
  id: 'unit-test-part',
  name: 'Test block',
  category: 'Hardware',
  description: 'Unit test fixture',
  vendors: [{ name: 'Test vendor', url: 'https://example.com/block' }],
};

test('vendors remain absent on hover and toggle explicitly with pointer or keyboard', async () => {
  const user = userEvent.setup();
  render(<PartCard part={part} />);
  const toggle = screen.getByRole('button', { name: 'Show vendors' });
  expect(toggle).toHaveAttribute('aria-expanded', 'false');
  expect(document.getElementById(toggle.getAttribute('aria-controls'))).toBeInTheDocument();
  expect(screen.queryByRole('link')).not.toBeInTheDocument();
  await user.hover(toggle);
  expect(toggle).toBeVisible();
  expect(screen.queryByRole('link')).not.toBeInTheDocument();
  await act(async () => { await user.click(toggle); });
  expect(toggle).toHaveAccessibleName('Hide vendors');
  expect(toggle).toHaveAttribute('aria-expanded', 'true');
  expect(screen.getByRole('link', { name: 'Test vendor' })).toHaveAttribute('href', part.vendors[0].url);
  await user.unhover(toggle);
  expect(toggle).toBeVisible();
  toggle.focus();
  await act(async () => { await user.keyboard('{Enter}'); });
  expect(toggle).toHaveAttribute('aria-expanded', 'false');
  expect(screen.queryByRole('link')).not.toBeInTheDocument();
  expect(toggle).toHaveFocus();
  await act(async () => { await user.keyboard(' '); });
  expect(screen.getByRole('link', { name: 'Test vendor' })).toBeVisible();
});
