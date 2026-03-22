type Props = {
  email: string;
  role: "educator" | "student";
};

export default function AppTopbar({ email, role }: Props) {
  return (
    <header className="border-b bg-white px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold capitalize">{role} dashboard</h1>
          <p className="text-sm text-neutral-500">{email}</p>
        </div>
      </div>
    </header>
  );
}
