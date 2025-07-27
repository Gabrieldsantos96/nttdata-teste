import { ValidationMessages } from "~/utils/validation-messages";
import { z } from "zod";

export const signinSchema = z.object({
  email: z
    .string()
    .nonempty()
    .email(ValidationMessages.FieldValueInvalid.replace("{field}", "email")),
  password: z
    .string()
    .nonempty(ValidationMessages.FieldRequired.replace("{field}", "senha")),
});

export type SignInFormData = z.infer<typeof signinSchema>;
