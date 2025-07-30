import z from "zod";
import { ValidationMessages } from "~/utils/validation-messages";

export const createProductSchema = z.object({
  id: z.string().optional(),
  title: z
    .string()
    .nonempty(ValidationMessages.FieldRequired.replace("{field}", "titulo")),
  description: z
    .string()
    .nonempty(ValidationMessages.FieldRequired.replace("{field}", "descrição")),
  price: z
    .number()
    .min(0.1, ValidationMessages.FieldRequired.replace("{field}", "preço")),
  category: z
    .string()
    .nonempty(ValidationMessages.FieldRequired.replace("{field}", "categoria")),
  image: z
    .string()
    .nonempty(ValidationMessages.FieldRequired.replace("{field}", "imagem")),
});

export type ProductFormData = z.infer<typeof createProductSchema>;
