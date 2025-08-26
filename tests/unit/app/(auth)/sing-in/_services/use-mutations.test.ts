import { signIn, signOut } from '@/app/(auth)/sign-in/_services/mutations';
import { useSignIn, useSignOut } from '@/app/(auth)/sign-in/_services/use-mutations';
import { SignInSchema } from '@/app/(auth)/sign-in/_types/sign-in-schema';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@tanstack/react-query', () => ({
  useMutation: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

vi.mock('@/app/(auth)/sign-in/_services/mutations', () => ({
  signIn: vi.fn(),
  signOut: vi.fn(),
}));

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const useMutationMock = useMutation as vi.Mock;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const useRouterMock = useRouter as vi.Mock;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const signInMock = signIn as vi.Mock;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const signOutMock = signOut as vi.Mock;

describe('use-mutations', () => {
  const mockRouterPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useRouterMock.mockReturnValue({ push: mockRouterPush });
  });

  describe('useSignIn', () => {
    it('test_useSignIn_calls_signIn_on_mutate_with_valid_data', async () => {
      useSignIn();
      const mutationOptions = useMutationMock.mock.calls[0][0];
      const validData: SignInSchema = {
        email: 'test@example.com',
        password: 'password123',
      };
      signInMock.mockResolvedValue(undefined);

      await mutationOptions.mutationFn(validData);

      expect(signInMock).toHaveBeenCalledWith(validData);
    });

    it('test_useSignIn_handles_error_on_mutation_failure', async () => {
      const error = new Error('Invalid credentials');
      signInMock.mockRejectedValue(error);
      useSignIn();
      const mutationOptions = useMutationMock.mock.calls[0][0];
      const data: SignInSchema = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      await expect(mutationOptions.mutationFn(data)).rejects.toThrow(
        'Invalid credentials',
      );
      expect(signInMock).toHaveBeenCalledWith(data);
    });

    it('test_useSignIn_fails_when_data_violates_schema', async () => {
      const validationError = new Error('Validation failed');
      signInMock.mockRejectedValue(validationError);
      useSignIn();
      const mutationOptions = useMutationMock.mock.calls[0][0];
      const invalidData = { email: '', password: '' } as SignInSchema;

      await expect(mutationOptions.mutationFn(invalidData)).rejects.toThrow(
        'Validation failed',
      );
      expect(signInMock).toHaveBeenCalledWith(invalidData);
    });
  });

  describe('useSignOut', () => {
    it('test_useSignOut_calls_signOut_on_mutate', async () => {
      useSignOut();
      const mutationOptions = useMutationMock.mock.calls[0][0];
      signOutMock.mockResolvedValue(undefined);

      await mutationOptions.mutationFn();

      expect(signOutMock).toHaveBeenCalled();
    });

    it('test_useSignOut_redirects_to_signIn_page_on_success', () => {
      useSignOut();
      const mutationOptions = useMutationMock.mock.calls[0][0];

      mutationOptions.onSuccess();

      expect(mockRouterPush).toHaveBeenCalledWith('/sign-in');
    });

    it('test_useSignOut_does_not_redirect_on_mutation_failure', async () => {
      const error = new Error('Sign out failed');
      signOutMock.mockRejectedValue(error);
      useSignOut();
      const mutationOptions = useMutationMock.mock.calls[0][0];

      await expect(mutationOptions.mutationFn()).rejects.toThrow('Sign out failed');
      expect(signOutMock).toHaveBeenCalled();
      expect(mockRouterPush).not.toHaveBeenCalled();
    });
  });
});