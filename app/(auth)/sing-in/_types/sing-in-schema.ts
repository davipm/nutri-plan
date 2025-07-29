import { z } from "zod";

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
