export interface AuthUser {
  id: string;
  email: string;
  name?: string | null;
}
export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}
export interface LoginInput {
  email: string;
  password: string;
}
export interface RegisterInput extends LoginInput {
  name?: string;
}
export interface AuthFormValues {
  email: string;
  name: string;
  password: string;
}
export type AuthMode = "login" | "register";
export type AuthFormErrors = Partial<Record<keyof AuthFormValues, string>>;
