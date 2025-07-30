import z from "zod";
import { ValidationMessages } from "~/utils/validation-messages";

export const cartSchema = z.object({
  Items: z.array(
    z.object({
      productId: z
        .string()
        .nonempty(
          ValidationMessages.FieldRequired.replace("{field}", "ID do produto")
        ),
      productName: z
        .string()
        .nonempty(
          ValidationMessages.FieldRequired.replace("{field}", "nome do produto")
        ),
      quantity: z
        .number()
        .min(
          0,
          ValidationMessages.FieldRequired.replace("{field}", "quantidade")
        ),
    })
  ),
});

export type CreateCartFormData = z.infer<typeof cartSchema>;
