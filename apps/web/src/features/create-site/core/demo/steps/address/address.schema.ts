import { addressSchema } from "shared";
import z from "zod";

export const addressSelectionSchema = z.object({
  address: addressSchema,
});
