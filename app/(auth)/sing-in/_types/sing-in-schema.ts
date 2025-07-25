import { z } from "zod";

const singInSchema = z.object({
  email: z.string(),
  password: z.string(),
});

type SingInSchema = z.infer<typeof singInSchema>;

const singInDefaultValues: SingInSchema = {
  email: "",
  password: "",
};

export { singInSchema, singInDefaultValues, type SingInSchema };
