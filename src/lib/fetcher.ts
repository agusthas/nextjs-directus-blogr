import { DIRECTUS_CONSTANTS } from "@/utils/constant";
import axios from "axios";

const fetcher = axios.create({
  baseURL: DIRECTUS_CONSTANTS.BASE_URL,
});

export default fetcher;
