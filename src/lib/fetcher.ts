import axios from "axios";

const fetcher = axios.create({
  baseURL: "https://5ru1zdqh.directus.app",
});

export default fetcher;
