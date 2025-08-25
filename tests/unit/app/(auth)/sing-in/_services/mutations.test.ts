import { signIn, signOut } from '@/app/(auth)/sign-in/_services/mutations';
import { SignInSchema } from '@/app/(auth)/sign-in/_types/sign-in-schema';
import { signOut as authSignOut, signIn as nextAuthSingIn } from '@/lib/auth';
import { executeAction } from '@/lib/execute-action';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ZodError } from 'zod';

vi.mock('@/lib/auth', () => ({
  signIn: vi.fn(),
  signOut: vi.fn(),
}));

vi.mock('@/lib/execute-action', () => ({
  executeAction: vi.fn(async ({ actionFn }) => actionFn()),
}));

const mockedNextAuthSingIn = vi.mocked(nextAuthSingIn);
const mockedAuthSingOut = vi.mocked(authSignOut);
const mockedExecuteAction = vi.mocked(executeAction);

describe('mutations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('singIn', () => {
    it('test_singIn_with_valid_credentials_succeeds', async () => {
      const validData: SignInSchema = {
        email: 'test@example.com',
        password: 'password123',
      };
      mockedNextAuthSingIn.mockResolvedValue(undefined);

      await signIn(validData);

      expect(mockedExecuteAction).toHaveBeenCalledOnce();
      const executeActionCall = mockedExecuteAction.mock.calls[0][0];
      await executeActionCall.actionFn(); // Await the inner function to check its calls

      expect(mockedNextAuthSingIn).toHaveBeenCalledWith('credentials', validData);
      expect(mockedAuthSingOut).toHaveBeenCalledTimes(0);
    });

    it('test_singIn_with_extra_data_fields_succeeds', async () => {
      const dataWithExtra = {
        email: 'test@example.com',
        password: 'password123',
        extraField: 'should be stripped',
      };
      const expectedData: SignInSchema = {
        email: 'test@example.com',
        password: 'password123',
      };
      mockedNextAuthSingIn.mockResolvedValue(undefined);

      await signIn(dataWithExtra);

      expect(mockedExecuteAction).toHaveBeenCalledOnce();
      const executeActionCall = mockedExecuteAction.mock.calls[0][0];
      await executeActionCall.actionFn();

      expect(mockedNextAuthSingIn).toHaveBeenCalledWith('credentials', expectedData);
      expect(mockedAuthSingOut).toHaveBeenCalledTimes(0);
    });

    it('test_singIn_with_invalid_credentials_throws_error', async () => {
      const invalidData: SignInSchema = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };
      const authError = new Error('Authentication failed');
      mockedNextAuthSingIn.mockRejectedValue(authError);

      await expect(signIn(invalidData)).rejects.toThrow(authError);

      expect(mockedExecuteAction).toHaveBeenCalledOnce();
      expect(mockedNextAuthSingIn).toHaveBeenCalledWith('credentials', invalidData);
    });

    it('test_singIn_with_malformed_data_throws_validation_error', async () => {
      const malformedData = {
        email: '',
        password: 'password123',
      } as SignInSchema;

      await expect(signIn(malformedData)).rejects.toThrow(ZodError);

      expect(mockedExecuteAction).toHaveBeenCalledOnce();
      expect(mockedNextAuthSingIn).not.toHaveBeenCalled();
    });

    it('test_action_execution_handles_unexpected_auth_service_errors', async () => {
      const validData: SignInSchema = {
        email: 'test@example.com',
        password: 'password123',
      };
      const unexpectedError = new Error('Database connection issue');
      mockedNextAuthSingIn.mockRejectedValue(unexpectedError);

      await expect(signIn(validData)).rejects.toThrow(unexpectedError);

      expect(mockedExecuteAction).toHaveBeenCalledOnce();
      expect(mockedNextAuthSingIn).toHaveBeenCalledWith('credentials', validData);
    });
  });

  describe('singOut', () => {
    it('test_singOut_successfully_signs_out_user', async () => {
      mockedAuthSingOut.mockResolvedValue(undefined);

      await signOut();

      expect(mockedExecuteAction).toHaveBeenCalledOnce();
      const executeActionCall = mockedExecuteAction.mock.calls[0][0];
      expect(executeActionCall.actionFn).toBe(authSignOut);

      // To ensure the mock actually called the inner function
      await executeActionCall.actionFn();
      expect(mockedAuthSingOut).toHaveBeenCalledTimes(2);
    });
  });
});
