import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock all dependencies at the top level
vi.mock('@/app/(auth)/sign-in/_services/use-mutations', () => ({
  useSignIn: vi.fn(),
}));

vi.mock('@/app/(auth)/sign-in/_types/sign-in-schema', () => ({
  signInDefaultValues: { email: '', password: '' },
  signInSchema: {
    parse: vi.fn(),
  },
}));

vi.mock('@/components/controlled-input', () => ({
  ControlledInput: ({ name, label, type = 'text' }: any) => (
    <div>
      <label htmlFor={name}>{label}</label>
      <input id={name} name={name} type={type} />
    </div>
  ),
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, disabled, type, className, ...props }: any) => (
    <button type={type} disabled={disabled} className={className} {...props}>
      {children}
    </button>
  ),
}));

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock('react-hook-form', () => ({
  FormProvider: ({ children }: any) => <div>{children}</div>,
  useForm: () => ({
    handleSubmit: (fn: any) => (e: any) => {
      e.preventDefault();
      fn({ email: 'test@example.com', password: 'password123' });
    },
  }),
}));

vi.mock('@hookform/resolvers/zod', () => ({
  zodResolver: () => ({}),
}));

vi.mock('lucide-react', () => ({
  Loader2Icon: () => <div data-testid="loader-icon" />,
}));

// Import after mocks
import { SignInForm } from '@/app/(auth)/sign-in/_components/sign-in-form';
import { useSignIn } from '@/app/(auth)/sign-in/_services/use-mutations';

const mockMutate = vi.fn();
const mockUseSignIn = vi.mocked(useSignIn);

describe('SignInForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseSignIn.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    } as any);
  });

  it('test_renders_all_form_elements_correctly', () => {
    render(<SignInForm />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /sign up/i })).toBeInTheDocument();
  });

  it('test_navigates_to_sign_up_page_on_link_click', () => {
    render(<SignInForm />);
    const signUpLink = screen.getByRole('link', { name: /sign up/i });
    expect(signUpLink).toHaveAttribute('href', '/sign-up');
  });

  it('test_disables_button_and_shows_loader_during_submission', () => {
    mockUseSignIn.mockReturnValue({
      mutate: mockMutate,
      isPending: true,
    } as any);

    render(<SignInForm />);

    const button = screen.getByRole('button', { name: /sign in/i });
    expect(button).toBeDisabled();
    expect(screen.getByTestId('loader-icon')).toBeInTheDocument();
  });

  it('test_renders_welcome_message', () => {
    render(<SignInForm />);
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
  });

  it('test_renders_sign_up_link_text', () => {
    render(<SignInForm />);
    expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
  });

  it('test_form_has_correct_structure', () => {
    render(<SignInForm />);
    const form = screen.getByRole('button', { name: /sign in/i }).closest('form');
    expect(form).toBeInTheDocument();
    expect(form).toHaveClass('w-full', 'max-w-96', 'space-y-5');
  });
});
