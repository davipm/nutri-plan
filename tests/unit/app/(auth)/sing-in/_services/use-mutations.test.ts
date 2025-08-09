import { describe, it, expect, vi, beforeEach } from "vitest";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  useSingIn,
  useSingOut,
} from "@/app/(auth)/sing-in/_services/use-mutations";
import { singIn, singOut } from "@/app/(auth)/sing-in/_services/mutations";
import { SingInSchema } from "@/app/(auth)/sing-in/_types/sing-in-schema";

vi.mock("@tanstack/react-query", () => ({
  useMutation: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

vi.mock("@/app/(auth)/sing-in/_services/mutations", () => ({
  singIn: vi.fn(),
  singOut: vi.fn(),
}));

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const useMutationMock = useMutation as vi.Mock;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const useRouterMock = useRouter as vi.Mock;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const singInMock = singIn as vi.Mock;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const singOutMock = singOut as vi.Mock;

describe("use-mutations", () => {
  const mockRouterPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useRouterMock.mockReturnValue({ push: mockRouterPush });
  });

  describe("useSingIn", () => {
    it("test_useSingIn_calls_singIn_on_mutate_with_valid_data", async () => {
      useSingIn();
      const mutationOptions = useMutationMock.mock.calls[0][0];
      const validData: SingInSchema = {
        email: "test@example.com",
        password: "password123",
      };
      singInMock.mockResolvedValue(undefined);

      await mutationOptions.mutationFn(validData);

      expect(singInMock).toHaveBeenCalledWith(validData);
    });

    it("test_useSingIn_handles_error_on_mutation_failure", async () => {
      const error = new Error("Invalid credentials");
      singInMock.mockRejectedValue(error);
      useSingIn();
      const mutationOptions = useMutationMock.mock.calls[0][0];
      const data: SingInSchema = {
        email: "test@example.com",
        password: "wrongpassword",
      };

      await expect(mutationOptions.mutationFn(data)).rejects.toThrow(
        "Invalid credentials",
      );
      expect(singInMock).toHaveBeenCalledWith(data);
    });

    it("test_useSingIn_fails_when_data_violates_schema", async () => {
      const validationError = new Error("Validation failed");
      singInMock.mockRejectedValue(validationError);
      useSingIn();
      const mutationOptions = useMutationMock.mock.calls[0][0];
      const invalidData = { email: "", password: "" } as SingInSchema;

      await expect(mutationOptions.mutationFn(invalidData)).rejects.toThrow(
        "Validation failed",
      );
      expect(singInMock).toHaveBeenCalledWith(invalidData);
    });
  });

  describe("useSingOut", () => {
    it("test_useSingOut_calls_singOut_on_mutate", async () => {
      useSingOut();
      const mutationOptions = useMutationMock.mock.calls[0][0];
      singOutMock.mockResolvedValue(undefined);

      await mutationOptions.mutationFn();

      expect(singOutMock).toHaveBeenCalled();
    });

    it("test_useSingOut_redirects_to_signIn_page_on_success", () => {
      useSingOut();
      const mutationOptions = useMutationMock.mock.calls[0][0];

      mutationOptions.onSuccess();

      expect(mockRouterPush).toHaveBeenCalledWith("/sing-in");
    });

    it("test_useSingOut_does_not_redirect_on_mutation_failure", async () => {
      const error = new Error("Sign out failed");
      singOutMock.mockRejectedValue(error);
      useSingOut();
      const mutationOptions = useMutationMock.mock.calls[0][0];

      await expect(mutationOptions.mutationFn()).rejects.toThrow(
        "Sign out failed",
      );
      expect(singOutMock).toHaveBeenCalled();
      expect(mockRouterPush).not.toHaveBeenCalled();
    });
  });
});
