import { z } from "zod";

export const UserSchema = z.object({
  id: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  avatar: z.string().nullable(),
  email: z.string().email(),
});

export type User = z.infer<typeof UserSchema>;
