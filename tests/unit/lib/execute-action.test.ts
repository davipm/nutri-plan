import { describe, it, expect, vi, beforeEach } from "vitest";
import { ZodError } from "zod";
import { executeAction } from "@/lib/execute-action";
import { getErrorMessage } from "@/lib/get-error-message";
import { isRedirectError } from "next/dist/client/components/redirect-error";

vi.mock("@/lib/get-error-message", () => ({
  getErrorMessage: vi.fn(),
}));

vi.mock("next/dist/client/components/redirect-error", () => ({
  isRedirectError: vi.fn(),
}));

describe("executeAction", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("test_should_complete_without_error_when_actionFn_succeeds", async () => {
    const actionFn = vi.fn().mockResolvedValue(undefined);

    await expect(executeAction({ actionFn })).resolves.not.toThrow();
    expect(actionFn).toHaveBeenCalledOnce();
  });

  it("test_should_throw_new_error_with_message_for_standard_error", async () => {
    const error = new Error("A standard error occurred");
    const actionFn = vi.fn().mockRejectedValue(error);
    vi.mocked(isRedirectError).mockReturnValue(false);
    vi.mocked(getErrorMessage).mockReturnValue("A standard error occurred");

    await expect(executeAction({ actionFn })).rejects.toThrowError(
      "A standard error occurred",
    );

    expect(isRedirectError).toHaveBeenCalledWith(error);
    expect(getErrorMessage).toHaveBeenCalledWith(error);
  });

  it("test_should_throw_new_error_with_formatted_zod_error_message", async () => {
    const zodError = new ZodError([]);
    const actionFn = vi.fn().mockRejectedValue(zodError);
    vi.mocked(isRedirectError).mockReturnValue(false);
    vi.mocked(getErrorMessage).mockReturnValue("Validation error occurred.");

    await expect(executeAction({ actionFn })).rejects.toThrowError(
      "Validation error occurred.",
    );

    expect(isRedirectError).toHaveBeenCalledWith(zodError);
    expect(getErrorMessage).toHaveBeenCalledWith(zodError);
  });

  it("test_should_rethrow_original_error_when_it_is_a_redirect_error", async () => {
    const redirectError = new Error("NEXT_REDIRECT");
    const actionFn = vi.fn().mockRejectedValue(redirectError);
    vi.mocked(isRedirectError).mockReturnValue(true);

    await expect(executeAction({ actionFn })).rejects.toThrow(redirectError);

    expect(isRedirectError).toHaveBeenCalledWith(redirectError);
    expect(getErrorMessage).not.toHaveBeenCalled();
  });

  it("test_should_throw_generic_error_message_when_non_error_is_thrown", async () => {
    const nonError = "some string error";
    const actionFn = vi.fn().mockRejectedValue(nonError);
    vi.mocked(isRedirectError).mockReturnValue(false);
    vi.mocked(getErrorMessage).mockReturnValue("An unexpected error occurred.");

    await expect(executeAction({ actionFn })).rejects.toThrowError(
      "An unexpected error occurred.",
    );

    expect(isRedirectError).toHaveBeenCalledWith(nonError);
    expect(getErrorMessage).toHaveBeenCalledWith(nonError);
  });

  it("test_should_throw_new_error_with_formatted_prisma_error_message", async () => {
    const { Prisma } = await import("@prisma/client");

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const prismaError = new Prisma.PrismaClientKnownRequestError(
      "Unique constraint failed",
      {
        code: "P2002",
        clientVersion: "5.0.0",
      },
    );
    const actionFn = vi.fn().mockRejectedValue(prismaError);
    vi.mocked(isRedirectError).mockReturnValue(false);
    vi.mocked(getErrorMessage).mockReturnValue("Unique constraint failed");

    await expect(executeAction({ actionFn })).rejects.toThrowError(
      "Unique constraint failed",
    );

    expect(isRedirectError).toHaveBeenCalledWith(prismaError);
    expect(getErrorMessage).toHaveBeenCalledWith(prismaError);
  });
});
