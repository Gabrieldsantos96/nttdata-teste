import axios from "axios";

export const API_HTTP_URL = "/api";

const httpClient = axios.create({
  baseURL: API_HTTP_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default httpClient;
