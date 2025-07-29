import * as z from "zod";
import { passwordSchema, requiredStringSchema } from "@/lib/zod-schemas";

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
