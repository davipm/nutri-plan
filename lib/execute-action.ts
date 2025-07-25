import { getErrorMessage } from "@/lib/get-error-message";
import { isRedirectError } from "next/dist/client/components/redirect-error";

type Options<T> = {
  actionFn: () => Promise<T>;
};

/**
 * Executes the provided asynchronous action function within a try-catch block.
 * If the action encounters an error categorized as a redirect error, it rethrows the original error.
 * For all other errors, it throws a custom error with a descriptive message.
 *
 * @template T The type of the expected input for the action function.
 * @param {Object} options An object containing the parameters for the execution.
 * @param {function(): Promise<T>} options.actionFn The asynchronous function to be executed.
 * @throws {Error} Throws a rethrown error if it is a redirect error or a new error with a message derived from the encountered error.
 */
export const executeAction = async <T>({ actionFn }: Options<T>) => {
  try {
    await actionFn();
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    throw new Error(getErrorMessage(error));
  }
};
