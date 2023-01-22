import fetcher from "@/lib/fetcher";
import { z } from "zod";
import { createResponseSchemaFor } from "../helper";
import { CreatePostData, CreatePostDataSchema, PostSchema } from "./schema";

export type Post = z.infer<typeof PostSchema>;

export const getPosts = async () => {
  const response = await fetcher.get("/items/posts", {
    params: {
      fields: ["*.*"],
    },
  });
  const data = createResponseSchemaFor(PostSchema).parse(response.data);
  return data.data;
};

export const getPost = async (id: string) => {
  const response = await fetcher.get(`/items/posts/${id}`, {
    params: {
      fields: ["*.*"],
    },
  });
  const data = createResponseSchemaFor(PostSchema).parse(response.data);
  return data.data;
};

export const createPost = async (data: CreatePostData, accessToken: string) => {
  const body = CreatePostDataSchema.parse(data);
  const response = await fetcher.post("/items/posts", body, {
    headers: {
      Authorization: "Bearer " + accessToken,
    },
    params: {
      fields: ["*.*"],
    },
  });

  const post = createResponseSchemaFor(PostSchema).parse(response.data);
  return post.data;
};

export const deletePost = async (id: string, accessToken: string) => {
  try {
    const response = await fetcher.delete(`/items/posts/${id}`, {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    });

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
