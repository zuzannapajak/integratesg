import SocialLoginButtons from "@/components/auth/social-login-buttons";
import LoginForm from "../../../../../components/auth/login-form";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function LoginPage({ params }: Props) {
  const { locale } = await params;

  return (
    <main className="mx-auto max-w-md p-8">
      <h1 className="mb-6 text-2xl font-bold">Login</h1>
      <LoginForm />
      <SocialLoginButtons locale={locale} />
    </main>
  );
}
