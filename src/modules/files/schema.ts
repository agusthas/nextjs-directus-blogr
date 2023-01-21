import { z } from "zod";
import { createResponseSchemaFor } from "../helper";

export const ImportFileSchema = z.object({
  url: z.string().url({ message: "Please enter a valid URL" }),
});

export type ImportFile = z.infer<typeof ImportFileSchema>;

export const ImportFileResponseSchema = createResponseSchemaFor(
  z.object({
    id: z.string(),
  })
);
