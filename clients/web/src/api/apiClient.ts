import axios from "axios";
import type { AxiosError } from "axios";
import type { AuthResponse } from "../types/auth";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

export const DEMO_AUTH_CREDENTIALS = {
  email: import.meta.env.VITE_DEMO_EMAIL ?? "demo@example.com",
  name: import.meta.env.VITE_DEMO_NAME ?? "Demo User",
  password: import.meta.env.VITE_DEMO_PASSWORD ?? "password123",
};

const TOKEN_STORAGE_KEY = "rangein.accessToken";
const USER_STORAGE_KEY = "rangein.user";
const AUTH_LOGOUT_EVENT = "rangein:logout";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export function getStoredAuth(): AuthResponse | null {
  const accessToken = localStorage.getItem(TOKEN_STORAGE_KEY);
  const rawUser = localStorage.getItem(USER_STORAGE_KEY);

  if (!accessToken || !rawUser) {
    clearStoredAuth({ notify: false });
    return null;
  }

  try {
    return {
      accessToken,
      user: JSON.parse(rawUser) as AuthResponse["user"],
    };
  } catch {
    clearStoredAuth({ notify: false });
    return null;
  }
}

export function setStoredAuth(auth: AuthResponse) {
  localStorage.setItem(TOKEN_STORAGE_KEY, auth.accessToken);
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(auth.user));
}

export function clearStoredAuth(options: { notify?: boolean } = {}) {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(USER_STORAGE_KEY);
  if (options.notify ?? true)
    window.dispatchEvent(new Event(AUTH_LOGOUT_EVENT));
}

export function subscribeToLogout(callback: () => void) {
  window.addEventListener(AUTH_LOGOUT_EVENT, callback);
  return () => window.removeEventListener(AUTH_LOGOUT_EVENT, callback);
}

apiClient.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (accessToken && !config.url?.startsWith("/auth"))
    config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (
      error.response?.status === 401 &&
      !error.config?.url?.startsWith("/auth")
    )
      clearStoredAuth();
    throw error;
  },
);
