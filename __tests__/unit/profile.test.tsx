import { expect, test, vi, vitest } from 'vitest';
import {
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import Page from '../../src/app/profile/page';
import { renderWithProviders } from '../utils';

vitest.mock('next/navigation');

// Mocking the IntersectionObserver, matchMedia, and ResizeObserver APIs
// to prevent errors with EmblaCarousel
const MockIntersectionObserver = vi.fn(() => ({
  disconnect: vi.fn(),
  observe: vi.fn(),
  takeRecords: vi.fn(),
  unobserve: vi.fn(),
}));
vi.stubGlobal(`IntersectionObserver`, MockIntersectionObserver);
const MockmatchMedia = vi.fn(() => ({
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
}));
vi.stubGlobal(`matchMedia`, MockmatchMedia);
const MockresizeObserver = vi.fn(() => ({
  disconnect: vi.fn(),
  observe: vi.fn(),
  unobserve: vi.fn(),
}));
vi.stubGlobal(`ResizeObserver`, MockresizeObserver);

window.fetch = async (...args) => {
  return new Response(
    `{"firstName":"John","lastName":"Doe","avatar":"https://example.com/avatar.jpg","photos":[{"name":"Photo 1","url":"https://example.com/photo1.jpg"},{"name":"Photo 2","url":"https://example.com/photo2.jpg"}]}`,
    {
      status: 200,
      statusText: 'OK',
      headers: {
        'Content-type': 'application/json',
      },
    },
  );
};

test('Page', async () => {
  renderWithProviders(<Page />, {
    preloadedState: {
      login: {
        token: 'token',
      },
    },
  });
  await waitForElementToBeRemoved(() =>
    expect(screen.getByText('Loading...')).toBeDefined(),
  );
  await waitFor(
    () => expect(screen.getByText('First Name: John')).toBeDefined(),
    {
      timeout: 4000,
    },
  );
  const photos = screen.getAllByRole('img');

  expect(photos).toHaveLength(3);
});
