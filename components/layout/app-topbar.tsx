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
      ? "Access curriculum resources, courses, and work package areas."
      : role === "admin"
        ? "Review statistics, platform status, and administrative settings."
        : "Continue learning, review your courses, and access your profile areas.";

  const badge =
    role === "educator"
      ? "bg-[rgba(11,156,114,0.12)] text-[#0b9c72]"
      : role === "admin"
        ? "bg-[rgba(49,66,90,0.12)] text-[#31425a]"
        : "bg-[rgba(239,108,35,0.12)] text-[#ef6c23]";

  return (
    <header className="border-b border-[#e6ebf1] bg-white/88 px-6 py-4 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-6">
        <div>
          <div
            className={`inline-flex rounded-full px-3 py-1.5 text-[0.78rem] font-semibold uppercase tracking-[0.14em] ${badge}`}
          >
            {role}
          </div>
          <h1 className="mt-3 text-[1.2rem] font-semibold tracking-[-0.02em] text-[#31425a]">
            {title}
          </h1>
          <p className="mt-2 text-[0.92rem] text-[#667180]">{subtitle}</p>
        </div>

        <div className="hidden text-right md:block">
          <p className="text-[0.88rem] font-semibold text-[#31425a]">Signed in</p>
          <p className="mt-1 text-[0.9rem] text-[#667180]">{email}</p>
        </div>
      </div>
    </header>
  );
}
