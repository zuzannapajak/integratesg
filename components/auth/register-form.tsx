"use client";

import { createProfile } from "@/features/auth/actions";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

export default function RegisterForm() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"student" | "educator">("student");
  const [message, setMessage] = useState<string | null>(null);

  const handleRegister = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setMessage(null);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    if (data.user) {
      const userEmail = data.user.email;

      if (!userEmail) {
        setMessage("User created, but email is missing.");
        return;
      }

      try {
        await createProfile({
          userId: data.user.id,
          email: userEmail,
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

      <div className="space-y-2">
        <p className="font-medium">Choose your role:</p>

        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="student"
              checked={role === "student"}
              onChange={() => {
                setRole("student");
              }}
            />
            Student
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="educator"
              checked={role === "educator"}
              onChange={() => {
                setRole("educator");
              }}
            />
            Educator
          </label>
        </div>
      </div>

      <button type="submit" className="w-full rounded bg-black px-4 py-2 text-white">
        Register
      </button>

      {message && <p className="text-sm">{message}</p>}
    </form>
  );
}
