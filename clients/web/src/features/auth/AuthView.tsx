import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { isAxiosError } from "axios";
import { z } from "zod";
import { DEMO_AUTH_CREDENTIALS, setStoredAuth } from "../../api/apiClient";
import { login, register } from "../../api/authApi";
import type {
  AuthFormErrors,
  AuthFormValues,
  AuthMode,
} from "../../types/auth";
import { AuthViewProps } from "../../types/props";

const loginFormSchema = z.object({
  email: z.email("Enter a valid email").trim().toLowerCase(),
  password: z.string().trim().min(1, "Enter your password").max(128),
});

const registerFormSchema = z.object({
  email: z.email("Enter a valid email").trim().toLowerCase(),
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(80),
  password: z
    .string()
    .trim()
    .min(8, "Password must be at least 8 characters")
    .max(128),
});

const initialFormValues: AuthFormValues = {
  email: DEMO_AUTH_CREDENTIALS.email,
  name: DEMO_AUTH_CREDENTIALS.name,
  password: DEMO_AUTH_CREDENTIALS.password,
};

function getRequestErrorMessage(error: unknown) {
  if (isAxiosError<{ message?: string | string[] }>(error)) {
    const message = error.response?.data?.message;
    if (Array.isArray(message)) return message.join(". ");
    if (message) return message;
  }

  return "Could not complete authentication. Check the API and credentials.";
}

function toFormErrors(
  issues: readonly { path: readonly PropertyKey[]; message: string }[],
) {
  const nextErrors: AuthFormErrors = {};
  for (const issue of issues) {
    const field = issue.path[0] as keyof AuthFormValues | undefined;
    if (field) nextErrors[field] = issue.message;
  }
  return nextErrors;
}

export function AuthView({ onAuthenticated }: AuthViewProps) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [formValues, setFormValues] =
    useState<AuthFormValues>(initialFormValues);
  const [formErrors, setFormErrors] = useState<AuthFormErrors>({});
  const [requestError, setRequestError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isLogin = mode === "login";
  const updateField =
    (field: keyof AuthFormValues) => (event: ChangeEvent<HTMLInputElement>) => {
      setFormValues((current) => ({
        ...current,
        [field]: event.target.value,
      }));
      setFormErrors((current) => ({
        ...current,
        [field]: undefined,
      }));
      setRequestError(null);
    };

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setFormErrors({});
    setRequestError(null);
  };
  const submitForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setRequestError(null);

    if (isLogin) {
      const parsed = loginFormSchema.safeParse(formValues);
      if (!parsed.success) {
        setFormErrors(toFormErrors(parsed.error.issues));
        return;
      }
      try {
        setIsSubmitting(true);
        const auth = await login({
          email: parsed.data.email,
          password: parsed.data.password,
        });
        setStoredAuth(auth);
        onAuthenticated(auth);
      } catch (error) {
        setRequestError(getRequestErrorMessage(error));
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    const parsed = registerFormSchema.safeParse(formValues);
    if (!parsed.success) {
      setFormErrors(toFormErrors(parsed.error.issues));
      return;
    }
    try {
      setIsSubmitting(true);
      const auth = await register({
        email: parsed.data.email,
        name: parsed.data.name,
        password: parsed.data.password,
      });
      setStoredAuth(auth);
      onAuthenticated(auth);
    } catch (error) {
      setRequestError(getRequestErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-screen">
      <section className="auth-panel" aria-labelledby="auth-title">
        <p className="app-kicker">Rangein Task System</p>
        <div className="auth-header">
          <h1 id="auth-title">{isLogin ? "Log in" : "Create account"}</h1>
          <p>
            {isLogin
              ? "Use the prefilled test account or enter your credentials."
              : "Register a new account to start working with boards."}
          </p>
        </div>

        <div className="auth-tabs" role="tablist" aria-label="Auth mode">
          <button
            aria-selected={isLogin}
            className="auth-tab"
            onClick={() => switchMode("login")}
            role="tab"
            type="button"
          >
            Login
          </button>
          <button
            aria-selected={!isLogin}
            className="auth-tab"
            onClick={() => switchMode("register")}
            role="tab"
            type="button"
          >
            Register
          </button>
        </div>

        <form className="auth-form" noValidate onSubmit={submitForm}>
          {!isLogin && (
            <label className="auth-field">
              <span>Name</span>
              <input
                autoComplete="name"
                name="name"
                onChange={updateField("name")}
                placeholder="Demo User"
                value={formValues.name}
              />
              {formErrors.name && <small>{formErrors.name}</small>}
            </label>
          )}

          <label className="auth-field">
            <span>Email</span>
            <input
              autoComplete="email"
              name="email"
              onChange={updateField("email")}
              placeholder="demo@example.com"
              type="email"
              value={formValues.email}
            />
            {formErrors.email && <small>{formErrors.email}</small>}
          </label>

          <label className="auth-field">
            <span>Password</span>
            <input
              autoComplete={isLogin ? "current-password" : "new-password"}
              name="password"
              onChange={updateField("password")}
              placeholder="password123"
              type="password"
              value={formValues.password}
            />
            {formErrors.password && <small>{formErrors.password}</small>}
          </label>

          {requestError && <p className="form-error">{requestError}</p>}

          <button
            className="button-primary button-full"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Please wait..." : isLogin ? "Login" : "Register"}
          </button>
        </form>
      </section>
    </main>
  );
}
