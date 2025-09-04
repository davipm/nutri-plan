import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import { HasError } from '@/components/has-error';

describe('HasError', () => {
  it('renders with the default message', () => {
    render(
      <HasError
        isRefetching={false}
        refetchAction={() => {}}
      />,
    );
    expect(screen.getByText('Failed to load data')).toBeInTheDocument();
  });

  it('renders with a custom message', () => {
    const customMessage = 'Oops! Something went wrong.';
    render(
      <HasError
        isRefetching={false}
        refetchAction={() => {}}
        message={customMessage}
      />,
    );
    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  it('displays "Try Again" and is enabled when not refetching', () => {
    render(
      <HasError
        isRefetching={false}
        refetchAction={() => {}}
      />,
    );
    const button = screen.getByRole('button', { name: 'Retry fetching data' });
    expect(button).toHaveTextContent('Try Again');
    expect(button).toBeEnabled();
  });

  it('calls the refetch action on button click', async () => {
    const refetchActionMock = vi.fn();
    const user = userEvent.setup();
    render(
      <HasError
        isRefetching={false}
        refetchAction={refetchActionMock}
      />,
    );
    const button = screen.getByRole('button', { name: 'Retry fetching data' });
    await user.click(button);
    expect(refetchActionMock).toHaveBeenCalledTimes(1);
  });

  it('displays "Retrying..." and is disabled when refetching', () => {
    render(
      <HasError
        isRefetching={true}
        refetchAction={() => {}}
      />,
    );
    const button = screen.getByRole('button', { name: 'Retry fetching data' });
    expect(button).toHaveTextContent('Retrying...');
    expect(button).toBeDisabled();
  });

  it('does not call the refetch action when the button is clicked while disabled', async () => {
    const refetchActionMock = vi.fn();
    const user = userEvent.setup();
    render(
      <HasError
        isRefetching={true}
        refetchAction={refetchActionMock}
      />,
    );
    const button = screen.getByRole('button', { name: 'Retry fetching data' });
    await user.click(button);
    expect(refetchActionMock).not.toHaveBeenCalled();
  });
});
