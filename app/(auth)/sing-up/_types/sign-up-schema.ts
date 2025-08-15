import * as z from "zod";
import { passwordSchema, requiredStringSchema } from "@/lib/zod-schemas";

/**
 * Schema definition for user sign-up validation.
 *
 * This defines the structure and rules for validating user input during the sign-up process.
 * The schema ensures that user-provided information meets all necessary requirements.
 *
 * Properties:
 * - name: A required string validated using the `requiredStringSchema`.
 * - email: A required string with a custom validation message when missing.
 * - password: A password validated using the `passwordSchema`.
 * - confirmPassword: A required string with a custom validation message when missing.
 *
 * Additional Rules:
 * - Ensures that the `password` and `confirmPassword` fields match.
 *   - If the values do not match, the validation fails and an error message
 *     ("Passwords don't match") is associated with the `confirmPassword` field.
 */
export const singUpSchema = z
  .object({
    name: requiredStringSchema,
    email: z.string().min(1, "Email is required."),
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Confirm Password is required."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type SingUpSchema = z.infer<typeof singUpSchema>;

export const singUpDefaultValues: SingUpSchema = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};
