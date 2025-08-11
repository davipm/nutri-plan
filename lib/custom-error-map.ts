import { z } from "zod";

/**
 * A custom Zod error map to provide user-friendly validation messages.
 * It overrides default messages for common issues like invalid types,
 * required fields, and size constraints for strings and numbers.
 */
const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
  switch (issue.code) {
    case "invalid_type":
      if (issue.received === "undefined" || issue.received === "null") {
        return { message: "This field is required" };
      }
      if (issue.expected === "string") {
        return { message: "Please enter text" };
      }
      if (issue.expected === "number") {
        return { message: "Please enter a number" };
      }
      return { message: `Invalid value type` };

    case "too_small":
      if (issue.type === "string") {
        return { message: `Minimum ${issue.minimum} characters required` };
      }
      if (issue.type === "number") {
        return {
          message: `Number must be greater than or equal to ${issue.minimum}`,
        };
      }
      return { message: `Value is too small` };

    case "too_big":
      if (issue.type === "string") {
        return { message: `Maximum ${issue.maximum} characters allowed` };
      }
      if (issue.type === "number") {
        return {
          message: `Number must be less than or equal to ${issue.maximum}`,
        };
      }
      return { message: `Value is too large` };

    case "custom":
      return { message: issue.message || "Invalid value" };

    default:
      return { message: ctx.defaultError };
  }
};

z.setErrorMap(customErrorMap);

export { customErrorMap };
