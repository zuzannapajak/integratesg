"use client";

import GoogleSignupButton from "@/components/auth/google-signup-button";
import RegisterForm from "@/components/auth/register-form";
import { useState } from "react";

type Props = {
  locale: string;
};

export default function RegisterClientPage({ locale }: Props) {
  const [role, setRole] = useState<"student" | "educator">("student");

  return (
    <main className="mx-auto max-w-md p-8 space-y-6">
      <h1 className="text-2xl font-bold">Create account</h1>

      <div className="space-y-3">
        <p className="font-medium">Choose your role</p>
        <p className="text-sm text-gray-600">
          Your selected role will be used when creating the account.
        </p>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => {
              setRole("student");
            }}
            className={`rounded border p-4 text-left ${
              role === "student" ? "border-black bg-gray-50" : ""
            }`}
          >
            <p className="font-medium">Student</p>
            <p className="text-sm text-gray-600">Access learning scenarios</p>
          </button>

          <button
            type="button"
            onClick={() => {
              setRole("educator");
            }}
            className={`rounded border p-4 text-left ${
              role === "educator" ? "border-black bg-gray-50" : ""
            }`}
          >
            <p className="font-medium">Educator</p>
            <p className="text-sm text-gray-600">Create and manage scenarios</p>
          </button>
        </div>
      </div>

      <GoogleSignupButton locale={locale} />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">or</span>
        </div>
      </div>

      <RegisterForm role={role} />
    </main>
  );
}
