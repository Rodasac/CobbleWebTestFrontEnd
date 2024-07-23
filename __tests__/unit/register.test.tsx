import { expect, test, vitest } from 'vitest';
import { screen } from '@testing-library/react';
import Page from '../../src/app/register/page';
import { renderWithProviders } from '../utils';

vitest.mock('next/navigation');

test('Page', () => {
  renderWithProviders(<Page />);
  const firstInput = screen.getByPlaceholderText('First Name');

  expect(firstInput).toBeDefined();
  expect(firstInput).toHaveProperty('type', 'text');
});
