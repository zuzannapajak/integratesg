import LoginForm from "../../../../components/auth/login-form";

export default function LoginPage() {
  return (
    <main className="mx-auto max-w-md p-8">
      <h1 className="mb-6 text-2xl font-bold">Login</h1>
      <LoginForm />
    </main>
  );
}
