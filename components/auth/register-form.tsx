"use client";

import { createProfile } from "@/features/auth/actions";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

type RegisterFormProps = {
  role: "student" | "educator";
};

export default function RegisterForm({ role }: RegisterFormProps) {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const handleRegister = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setMessage(null);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role,
        },
      },
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    if (data.user?.id && data.user.email) {
      try {
        await createProfile({
          userId: data.user.id,
          email: data.user.email,
          role,
        });
      } catch {
        setMessage("User created, but failed to save profile.");
        return;
      }
    }

    setMessage("Konto zostało utworzone.");
  };

  return (
    <form onSubmit={handleRegister} className="space-y-4">
      <input
        type="email"
        placeholder="Email"
        className="w-full rounded border p-3"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
        required
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full rounded border p-3"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
        required
      />

      <button type="submit" className="w-full rounded bg-black px-4 py-2 text-white">
        Create account
      </button>

      {message && <p className="text-sm">{message}</p>}
    </form>
  );
}
