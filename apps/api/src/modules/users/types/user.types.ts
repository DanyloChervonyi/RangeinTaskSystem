export interface CreateUserInput {
  email: string;
  name?: string;
  passwordHash: string;
}
export interface PublicUser {
  id: string;
  email: string;
  name?: string | null;
}
