import fetcher from "@/lib/fetcher";
import { z } from "zod";
import { PostSchema, GetPostsSchema, GetPostSchema } from "./schema";

export type Post = z.infer<typeof PostSchema>;

export const getPosts = async () => {
  const response = await fetcher.get("/items/posts", {
    params: {
      fields: ["*.*"],
    },
  });
  const data = GetPostsSchema.parse(response.data);
  return data.data;
};

export const getPost = async (id: string) => {
  const response = await fetcher.get(`/items/posts/${id}`, {
    params: {
      fields: ["*.*"],
    },
  });
  const data = GetPostSchema.parse(response.data);
  return data.data;
};
