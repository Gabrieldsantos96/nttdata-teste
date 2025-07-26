import axios from "axios";
import {
  AUTH_STORAGE_KEY,
  REFRESH_TOKEN_STORAGE_KEY,
  Routes,
} from "@/constants/consts";

const API_HTTP_URL = "/api";

const httpClient = axios.create({
  baseURL: API_HTTP_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

httpClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(AUTH_STORAGE_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

async function getRefreshToken() {
  try {
    const currentRefreshToken = localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
    if (!currentRefreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await axios.post(
      `${Routes.Authentication.REFRESH_TOKEN}`,
      { refreshToken: currentRefreshToken },
      { headers: { "Content-Type": "application/json" } }
    );

    const { accessToken, refreshToken } = response.data;

    localStorage.setItem(AUTH_STORAGE_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refreshToken);

    return accessToken;
  } catch (error) {
    console.log("getRefreshToken_error:", error.message);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
    throw error;
  }
}

httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== `${Routes.Authentication.REFRESH_TOKEN}`
    ) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await getRefreshToken();
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return httpClient(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default httpClient;
