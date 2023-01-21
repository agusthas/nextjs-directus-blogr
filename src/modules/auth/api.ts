import fetcher from "@/lib/fetcher";
import { importFile } from "../files/api";
import { createResponseSchemaFor } from "../helper";
import { UserSchema } from "../users/schema";
import {
  LoginUser,
  LoginUserSchema,
  RegisterUser,
  RegisterUserSchema,
  TokenSchema,
} from "./schema";

export const registerUser = async (input: RegisterUser) => {
  try {
    const avatarResponse = await importFile({ url: input.avatar });
    const body = RegisterUserSchema.parse(input);
    const response = await fetcher.post("/users", {
      ...body,
      avatar: avatarResponse.id,
    });
    if (!response.data) {
      throw new Error("No data returned");
    }

    const data = createResponseSchemaFor(UserSchema).parse(response.data);
    return data.data;
  } catch (error) {
    console.error(error);
  }
};

export const loginUser = async (input: LoginUser) => {
  try {
    const body = LoginUserSchema.parse(input);
    const response = await fetcher.post("/auth/login", body);
    if (!response.data) {
      throw new Error("No data returned");
    }

    const data = createResponseSchemaFor(TokenSchema).parse(response.data);
    return data.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
