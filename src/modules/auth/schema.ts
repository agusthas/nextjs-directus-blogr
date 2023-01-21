import { z } from "zod";

export const RegisterUserSchema = z.object({
  first_name: z
    .string()
    .min(1, { message: "First name cannot be empty" })
    .max(50, { message: "First name cannot be longer than 50 characters" }),
  last_name: z
    .string()
    .min(1, { message: "Last name cannot be empty" })
    .max(50, { message: "Last name cannot be longer than 50 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters",
  }),
  avatar: z.string(),
});

export const LoginUserSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string(),
});

export const TokenSchema = z.object({
  access_token: z.string(),
  expires: z.number(),
  refresh_token: z.string(),
});

export type RegisterUser = z.infer<typeof RegisterUserSchema>;
export type LoginUser = z.infer<typeof LoginUserSchema>;
export type Token = z.infer<typeof TokenSchema>;
