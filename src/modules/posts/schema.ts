import { formatDate } from "@/utils/date";
import { z } from "zod";

export const PostSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  created_at: z.string().transform((value) => formatDate(value)),
  updated_at: z
    .string()
    .nullable()
    .transform((value) => value && formatDate(value)),
  status: z.enum(["published", "draft"]),
  read_time: z.number(),
  author: z.object({
    first_name: z.string(),
    last_name: z.string(),
    email: z.string(),
    avatar: z.string().nullable(),
  }),
});

export const CreatePostDataSchema = z.object({
  title: z.string(),
  content: z.string(),
  read_time: z.number(),
  status: z.enum(["published", "draft"]).default("published"),
});

export const EditPostDataSchema = CreatePostDataSchema.partial();

export type CreatePostData = z.infer<typeof CreatePostDataSchema>;
export type EditPostData = z.infer<typeof EditPostDataSchema>;
