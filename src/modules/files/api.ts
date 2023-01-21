import fetcher from "@/lib/fetcher";
import { ImportFile, ImportFileResponseSchema } from "./schema";

export const importFile = async (input: ImportFile) => {
  const response = await fetcher.post("/files/import", input);
  if (response.status !== 200) {
    throw new Error(response.data.message);
  }

  const data = ImportFileResponseSchema.parse(response.data);
  return data.data;
};
