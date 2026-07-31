import type { AuthResponse, LoginInput, RegisterInput } from "../types/auth";
import { apiClient } from "./apiClient";

export async function login(input: LoginInput) {
  const { data } = await apiClient.post<AuthResponse>("/auth/login", input);
  return data;
}

export async function register(input: RegisterInput) {
  const { data } = await apiClient.post<AuthResponse>("/auth/register", input);
  return data;
}
