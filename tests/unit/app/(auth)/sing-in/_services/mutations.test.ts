import { vi, describe, it, expect, beforeEach } from "vitest";
import { singIn, singOut } from "@/app/(auth)/sing-in/_services/mutations";
import { signIn as nextAuthSingIn, signOut as authSingOut } from "@/lib/auth";
import { executeAction } from "@/lib/execute-action";
import { ZodError } from "zod";
import { SingInSchema } from "@/app/(auth)/sing-in/_types/sing-in-schema";

vi.mock("@/lib/auth", () => ({
  signIn: vi.fn(),
  signOut: vi.fn(),
}));

vi.mock("@/lib/execute-action", () => ({
  executeAction: vi.fn(async ({ actionFn }) => actionFn()),
}));

const mockedNextAuthSingIn = vi.mocked(nextAuthSingIn);
const mockedAuthSingOut = vi.mocked(authSingOut);
const mockedExecuteAction = vi.mocked(executeAction);

describe("mutations", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("singIn", () => {
    it("test_singIn_with_valid_credentials_succeeds", async () => {
      const validData: SingInSchema = {
        email: "test@example.com",
        password: "password123",
      };
      mockedNextAuthSingIn.mockResolvedValue(undefined);

      await singIn(validData);

      expect(mockedExecuteAction).toHaveBeenCalledOnce();
      const executeActionCall = mockedExecuteAction.mock.calls[0][0];
      await executeActionCall.actionFn(); // Await the inner function to check its calls

      expect(mockedNextAuthSingIn).toHaveBeenCalledWith(
        "credentials",
        validData,
      );
      expect(mockedAuthSingOut).toHaveBeenCalledTimes(0);
    });

    it("test_singIn_with_extra_data_fields_succeeds", async () => {
      const dataWithExtra = {
        email: "test@example.com",
        password: "password123",
        extraField: "should be stripped",
      };
      const expectedData: SingInSchema = {
        email: "test@example.com",
        password: "password123",
      };
      mockedNextAuthSingIn.mockResolvedValue(undefined);

      await singIn(dataWithExtra);

      expect(mockedExecuteAction).toHaveBeenCalledOnce();
      const executeActionCall = mockedExecuteAction.mock.calls[0][0];
      await executeActionCall.actionFn();

      expect(mockedNextAuthSingIn).toHaveBeenCalledWith(
        "credentials",
        expectedData,
      );
      expect(mockedAuthSingOut).toHaveBeenCalledTimes(0);
    });

    it("test_singIn_with_invalid_credentials_throws_error", async () => {
      const invalidData: SingInSchema = {
        email: "test@example.com",
        password: "wrongpassword",
      };
      const authError = new Error("Authentication failed");
      mockedNextAuthSingIn.mockRejectedValue(authError);

      await expect(singIn(invalidData)).rejects.toThrow(authError);

      expect(mockedExecuteAction).toHaveBeenCalledOnce();
      expect(mockedNextAuthSingIn).toHaveBeenCalledWith(
        "credentials",
        invalidData,
      );
    });

    it("test_singIn_with_malformed_data_throws_validation_error", async () => {
      const malformedData = {
        email: "",
        password: "password123",
      } as SingInSchema;

      await expect(singIn(malformedData)).rejects.toThrow(ZodError);

      expect(mockedExecuteAction).toHaveBeenCalledOnce();
      expect(mockedNextAuthSingIn).not.toHaveBeenCalled();
    });

    it("test_action_execution_handles_unexpected_auth_service_errors", async () => {
      const validData: SingInSchema = {
        email: "test@example.com",
        password: "password123",
      };
      const unexpectedError = new Error("Database connection issue");
      mockedNextAuthSingIn.mockRejectedValue(unexpectedError);

      await expect(singIn(validData)).rejects.toThrow(unexpectedError);

      expect(mockedExecuteAction).toHaveBeenCalledOnce();
      expect(mockedNextAuthSingIn).toHaveBeenCalledWith(
        "credentials",
        validData,
      );
    });
  });

  describe("singOut", () => {
    it("test_singOut_successfully_signs_out_user", async () => {
      mockedAuthSingOut.mockResolvedValue(undefined);

      await singOut();

      expect(mockedExecuteAction).toHaveBeenCalledOnce();
      const executeActionCall = mockedExecuteAction.mock.calls[0][0];
      expect(executeActionCall.actionFn).toBe(authSingOut);

      // To ensure the mock actually called the inner function
      await executeActionCall.actionFn();
      expect(mockedAuthSingOut).toHaveBeenCalledTimes(2);
    });
  });
});
