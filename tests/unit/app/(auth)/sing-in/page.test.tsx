import Page from '@/app/(auth)/sign-in/page';
import { Role } from '@/generated/prisma';
import { auth } from '@/lib/auth';
import { render, screen } from '@testing-library/react';
import { redirect } from 'next/navigation';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/auth', () => ({
  auth: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

vi.mock('@/app/(auth)/sign-in/_components/sign-in-form', () => ({
  SingInForm: () => <div data-testid="sign-in-form">Sign In Form</div>,
}));

const mockAuth = vi.mocked(auth);
const mockRedirect = vi.mocked(redirect);

describe('SignInPage', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('test_redirects_admin_user_to_admin_dashboard', async () => {
    mockAuth.mockResolvedValue({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      user: { id: 'admin-id', role: Role.ADMIN },
      expires: '1',
    });

    await Page();

    expect(mockRedirect).toHaveBeenCalledWith('/admin/foods-management/foods');
  });

  it('test_redirects_standard_user_to_client_dashboard', async () => {
    mockAuth.mockResolvedValue({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      user: { id: 'user-id', role: Role.USER },
      expires: '1',
    });

    await Page();

    expect(mockRedirect).toHaveBeenCalledWith('/client');
  });

  it('test_renders_sign_in_form_for_unauthenticated_user', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    mockAuth.mockResolvedValue(null);

    const PageComponent = await Page();
    render(PageComponent);

    expect(screen.getByTestId('sign-in-form')).toBeInTheDocument();
    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it('test_renders_form_for_user_with_unrecognized_role', async () => {
    mockAuth.mockResolvedValue({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      user: { id: 'guest-id', role: 'GUEST' as Role },
      expires: '1',
    });

    const PageComponent = await Page();
    render(PageComponent);

    expect(screen.getByTestId('sign-in-form')).toBeInTheDocument();
    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it('test_renders_form_when_session_exists_but_user_is_null', async () => {
    mockAuth.mockResolvedValue({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      user: null,
      expires: '1',
    });

    const PageComponent = await Page();
    render(PageComponent);

    expect(screen.getByTestId('sign-in-form')).toBeInTheDocument();
    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it('test_renders_form_when_user_exists_but_role_is_missing', async () => {
    mockAuth.mockResolvedValue({
      user: { id: 'user-id' },
      expires: '1',
    } as never);

    const PageComponent = await Page();
    render(PageComponent);

    expect(screen.getByTestId('sign-in-form')).toBeInTheDocument();
    expect(mockRedirect).not.toHaveBeenCalled();
  });
});
