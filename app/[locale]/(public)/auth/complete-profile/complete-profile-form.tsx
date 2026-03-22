"use client";

import { completeCurrentUserProfile } from "@/features/auth/actions";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type Props = {
  locale: string;
  email: string;
};

export default function CompleteProfileForm({ locale, email }: Props) {
  const router = useRouter();
  const [role, setRole] = useState<"student" | "educator">("student");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      try {
        await completeCurrentUserProfile({ role });
        router.replace(`/${locale}/dashboard`);
      } catch {
        setError("Failed to save profile.");
      }
    });
  };

  return (
    <main className="mx-auto max-w-md p-8 space-y-6">
      <h1 className="text-2xl font-bold">Complete your profile</h1>
      <p className="text-sm text-gray-600">{email}</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-3">
          <p className="font-medium">Choose your role</p>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => { setRole("student"); }}
              className={`rounded border p-4 text-left ${
                role === "student" ? "border-black bg-gray-50" : ""
              }`}
            >
              <p className="font-medium">Student</p>
              <p className="text-sm text-gray-600">Access learning scenarios</p>
            </button>

            <button
              type="button"
              onClick={() => { setRole("educator"); }}
              className={`rounded border p-4 text-left ${
                role === "educator" ? "border-black bg-gray-50" : ""
              }`}
            >
              <p className="font-medium">Educator</p>
              <p className="text-sm text-gray-600">Create and manage scenarios</p>
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Continue"}
        </button>

        {error && <p className="text-sm text-red-600">{error}</p>}
      </form>
    </main>
  );
}
