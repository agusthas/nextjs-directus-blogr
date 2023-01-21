import fetcher from "@/lib/fetcher";
import { createResponseSchemaFor } from "../helper";
import { UserSchema } from "./schema";

export const getMe = async (token: string) => {
  try {
    const response = await fetcher.get(`/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.data) {
      throw new Error("No data returned");
    }

    const data = createResponseSchemaFor(UserSchema).parse(response.data);
    return data.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
