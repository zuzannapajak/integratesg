import type { AnchorHTMLAttributes, ReactNode } from "react";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import ForgotPasswordForm from "@/components/auth/password-recovery/forgot-password-form";
import ResetPasswordForm from "@/components/auth/password-recovery/reset-password-form";
import RegisterDetailsStep from "@/components/auth/register/register-details-step";
import { APP_ROLES } from "@/lib/auth/roles";

const authMocks = vi.hoisted(() => ({
  resetPasswordForEmail: vi.fn(),
  exchangeCodeForSession: vi.fn(),
  setSession: vi.fn(),
  getSession: vi.fn(),
  updateUser: vi.fn(),
  signOut: vi.fn(),
  signUp: vi.fn(),
}));

const createProfileMock = vi.hoisted(() => vi.fn());

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: authMocks,
  }),
}));

vi.mock("@/features/auth/actions", () => ({
  createProfile: createProfileMock,
}));

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

type MockLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: ReactNode;
};

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: MockLinkProps) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("@/components/auth/login/social-login-buttons", () => ({
  default: () => <div data-testid="social-login-buttons" />,
}));

describe("auth form accessibility contracts", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    authMocks.resetPasswordForEmail.mockResolvedValue({ error: null });
    authMocks.exchangeCodeForSession.mockResolvedValue({ error: null });
    authMocks.setSession.mockResolvedValue({ error: null });
    authMocks.getSession.mockResolvedValue({
      data: {
        session: {
          user: {
            id: "user-1",
          },
        },
      },
    });
    authMocks.updateUser.mockResolvedValue({ error: null });
    authMocks.signOut.mockResolvedValue({ error: null });
    authMocks.signUp.mockResolvedValue({
      data: {
        session: null,
        user: null,
      },
      error: null,
    });
    createProfileMock.mockResolvedValue(undefined);
  });

  it("announces forgot-password submission errors and associates them with the email field", async () => {
    const user = userEvent.setup();

    authMocks.resetPasswordForEmail.mockResolvedValue({
      error: {
        message: "Reset failed",
      },
    });

    render(<ForgotPasswordForm locale="en" />);

    const emailInput = screen.getByLabelText("emailLabel");

    await user.type(emailInput, "person@example.com");
    await user.click(
      screen.getByRole("button", {
        name: "submit",
      }),
    );

    const alert = await screen.findByRole("alert");

    expect(alert).toHaveTextContent("Reset failed");
    expect(emailInput).toHaveAttribute("aria-invalid", "true");
    expect(emailInput).toHaveAttribute("aria-describedby", "forgot-password-message");
  });

  it("announces reset-password validation errors and associates them with both password fields", async () => {
    const user = userEvent.setup();

    render(<ResetPasswordForm locale="en" />);

    const passwordInput = await screen.findByLabelText("passwordLabel");
    const confirmPasswordInput = screen.getByLabelText("confirmPasswordLabel");

    await user.type(passwordInput, "short");
    await user.type(confirmPasswordInput, "short");
    await user.click(
      screen.getByRole("button", {
        name: "submit",
      }),
    );

    const alert = await screen.findByRole("alert");

    expect(alert).toHaveTextContent("passwordTooShort");
    expect(passwordInput).toHaveAttribute("aria-invalid", "true");
    expect(passwordInput).toHaveAttribute("aria-describedby", "reset-password-error");
    expect(confirmPasswordInput).toHaveAttribute("aria-invalid", "true");
    expect(confirmPasswordInput).toHaveAttribute("aria-describedby", "reset-password-error");
  });

  it("announces registration errors and associates them with the submitted credentials", async () => {
    const user = userEvent.setup();

    authMocks.signUp.mockResolvedValue({
      data: {
        session: null,
        user: null,
      },
      error: {
        message: "Sign up failed",
      },
    });

    render(
      <RegisterDetailsStep
        locale="en"
        role={APP_ROLES.learner}
        fullName="Test User"
        email="person@example.com"
        password="password-123"
        onFullNameChange={vi.fn()}
        onEmailChange={vi.fn()}
        onPasswordChange={vi.fn()}
        onBack={vi.fn()}
      />,
    );

    await user.click(
      screen.getByRole("button", {
        name: "submit",
      }),
    );

    const alert = await screen.findByRole("alert");
    const emailInput = screen.getByLabelText("email");
    const passwordInput = screen.getByLabelText("password");

    expect(alert).toHaveTextContent("Sign up failed");
    expect(emailInput).toHaveAttribute("aria-invalid", "true");
    expect(emailInput).toHaveAttribute("aria-describedby", "register-details-error");
    expect(passwordInput).toHaveAttribute("aria-invalid", "true");
    expect(passwordInput).toHaveAttribute("aria-describedby", "register-details-error");

    expect(authMocks.signUp).toHaveBeenCalledTimes(1);
  });
});
