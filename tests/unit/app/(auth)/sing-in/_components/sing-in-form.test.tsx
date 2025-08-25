import { SignInForm } from '@/app/(auth)/sign-in/_components/sign-in-form';
import * as useMutations from '@/app/(auth)/sign-in/_services/use-mutations';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

vi.mock('@/app/(auth)/sign-in/_services/use-mutations');

vi.mock('lucide-react', async (importOriginal) => {
  const original = await importOriginal<typeof import('lucide-react')>();
  return {
    ...original,
    Loader2Icon: () => <div data-testid="loader-icon" />,
  };
});

vi.mock('@/app/(auth)/sign-in/_types/sign-in-schema', () => ({
  singInDefaultValues: { email: '', password: '' },
  singInSchema: z.object({
    email: z.string().min(1, 'Email is required').email('Invalid email format'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must be at least 8 characters'),
  }),
}));

const mockUseSingIn = vi.mocked(useMutations.useSignIn);
const mockMutate = vi.fn();

describe('SingInForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseSingIn.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    } as unknown as ReturnType<typeof useMutations.useSignIn>);
  });

  it('test_renders_all_form_elements_correctly', () => {
    render(<SignInForm />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /sign up/i })).toBeInTheDocument();
  });

  it('test_submits_form_with_valid_credentials', async () => {
    const user = userEvent.setup();
    render(<SignInForm />);
    const validEmail = 'test@example.com';
    const validPassword = 'password123';

    await user.type(screen.getByLabelText(/email/i), validEmail);
    await user.type(screen.getByLabelText(/password/i), validPassword);
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        email: validEmail,
        password: validPassword,
      });
    });

    expect(screen.queryByText(/is required/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/invalid/i)).not.toBeInTheDocument();
  });

  it('test_navigates_to_sign_up_page_on_link_click', () => {
    render(<SignInForm />);
    const signUpLink = screen.getByRole('link', { name: /sign up/i });
    expect(signUpLink).toHaveAttribute('href', '/sign-up');
  });

  it('test_displays_validation_errors_for_invalid_input', async () => {
    const user = userEvent.setup();
    render(<SignInForm />);

    await user.type(screen.getByLabelText(/email/i), 'invalid-email');
    await user.type(screen.getByLabelText(/password/i), 'short');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText('Invalid email format')).toBeInTheDocument();
    expect(await screen.findByText('Password must be at least 8 characters')).toBeInTheDocument();
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('test_disables_button_and_shows_loader_during_submission', () => {
    mockUseSingIn.mockReturnValue({
      mutate: mockMutate,
      isPending: true,
    } as unknown as ReturnType<typeof useMutations.useSignIn>);

    render(<SignInForm />);

    const button = screen.getByRole('button', { name: /sign in/i });
    expect(button).toBeDisabled();
    expect(screen.getByTestId('loader-icon')).toBeInTheDocument();
  });

  it('test_shows_errors_on_empty_form_submission', async () => {
    const user = userEvent.setup();
    render(<SignInForm />);

    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText('Email is required')).toBeInTheDocument();
    expect(await screen.findByText('Password is required')).toBeInTheDocument();
    expect(mockMutate).not.toHaveBeenCalled();
  });
});
