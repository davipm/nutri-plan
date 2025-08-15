import { z } from "zod";

/**
 * `signInSchema` is a validation schema used for ensuring the correctness
 * of user input during the sign-in process. It is defined using the `zod`
 * library and validates the presence of required fields: `email` and `password`.
 *
 * - `email`: A string field that must not be empty.
 * - `password`: A string field that must not be empty.
 */
const singInSchema = z.object({
  email: z.string().min(1, "Email is required."),
  password: z.string().min(1, "Password is required."),
});

type SingInSchema = z.infer<typeof singInSchema>;

const singInDefaultValues: SingInSchema = {
  email: "",
  password: "",
};

export { singInSchema, singInDefaultValues, type SingInSchema };
