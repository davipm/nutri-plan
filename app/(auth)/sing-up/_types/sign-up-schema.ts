import * as z from "zod";
import { passwordSchema, requiredStringSchema } from "@/lib/zod-schemas";

export const singUpSchema = z
  .object({
    name: requiredStringSchema,
    email: z.string(),
    password: passwordSchema,
    confirmPassword: z.string(),
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
