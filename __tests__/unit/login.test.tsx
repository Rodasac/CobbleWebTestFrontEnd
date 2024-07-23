import { expect, test, vitest } from 'vitest';
import { screen } from '@testing-library/react';
import Page from '../../src/app/login/page';
import { renderWithProviders } from '../utils';

vitest.mock('next/navigation');

test('Page', () => {
  renderWithProviders(<Page />);
  const emailInput = screen.getByPlaceholderText('Email');

  expect(emailInput).toBeDefined();
  expect(emailInput).toHaveProperty('type', 'text');
});
