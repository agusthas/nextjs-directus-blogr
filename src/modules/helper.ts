import { z } from "zod";

export const createResponseSchemaFor = <T extends z.ZodTypeAny>(schema: T) => {
  return z.object({
    data: schema,
  });
};
