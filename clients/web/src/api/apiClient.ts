import axios from "axios";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";
const DEMO_EMAIL = import.meta.env.VITE_DEMO_EMAIL ?? "demo@example.com";
const DEMO_PASSWORD = import.meta.env.VITE_DEMO_PASSWORD ?? "password123";
const TOKEN_STORAGE_KEY = "rangein.accessToken";

let accessToken = localStorage.getItem(TOKEN_STORAGE_KEY);
let loginPromise: Promise<string> | undefined;

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

async function getDemoAccessToken() {
  if (accessToken) return accessToken;

  loginPromise ??= axios
    .post<{ accessToken: string }>(`${API_BASE_URL}/auth/login`, {
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
    })
    .then(({ data }) => {
      accessToken = data.accessToken;
      localStorage.setItem(TOKEN_STORAGE_KEY, data.accessToken);
      return data.accessToken;
    })
    .finally(() => {
      loginPromise = undefined;
    });

  return loginPromise;
}

apiClient.interceptors.request.use(async (config) => {
  if (!config.url?.startsWith("/auth"))
    config.headers.Authorization = `Bearer ${await getDemoAccessToken()}`;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      originalRequest.url?.startsWith("/auth")
    ) {
      throw error;
    }

    originalRequest._retry = true;
    accessToken = null;
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    originalRequest.headers.Authorization = `Bearer ${await getDemoAccessToken()}`;
    return apiClient(originalRequest);
  },
);
