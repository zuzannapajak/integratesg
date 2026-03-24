type Role = "educator" | "student" | "admin";

type Props = {
  email: string;
  role: Role;
};

export default function AppTopbar({ email, role }: Props) {
  const title =
    role === "educator"
      ? "Educator dashboard"
      : role === "admin"
        ? "Admin dashboard"
        : "Student dashboard";

  const subtitle =
    role === "educator"
      ? "Access courses, curriculum, scenarios, and ePortfolio resources."
      : role === "admin"
        ? "View basic program statistics and reporting indicators."
        : "Continue with scenarios and explore the ePortfolio.";

  return (
    <header className="border-b bg-white px-6 py-4">
      <div className="flex items-center justify-between gap-6">
        <div>
          <h1 className="text-lg font-semibold">{title}</h1>
          <p className="text-sm text-neutral-500">{subtitle}</p>
        </div>

        <div className="hidden text-right md:block">
          <p className="text-sm font-medium capitalize">{role}</p>
          <p className="text-sm text-neutral-500">{email}</p>
        </div>
      </div>
    </header>
  );
}
