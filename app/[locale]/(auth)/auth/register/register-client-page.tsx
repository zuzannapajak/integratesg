"use client";

import RegisterDetailsStep from "@/components/auth/register/register-details-step";
import RegisterRoleStep from "@/components/auth/register/register-role-step";
import RegisterStepper from "@/components/auth/register/register-stepper";
import { APP_ROLES, SelfServiceRole } from "@/lib/auth/roles";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

type Props = {
  locale: string;
};

type Step = 1 | 2;

export default function RegisterClientPage({ locale }: Props) {
  const [step, setStep] = useState<Step>(1);
  const [role, setRole] = useState<SelfServiceRole>(APP_ROLES.student);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <main className="min-h-full bg-white">
      <section className="relative flex w-full justify-center bg-white px-6 py-8 md:px-8 md:py-10 lg:px-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_18%,rgba(236,103,37,0.14),transparent_24%),radial-gradient(circle_at_86%_22%,rgba(13,127,194,0.16),transparent_28%),linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(249,250,251,0.98)_58%,rgba(255,255,255,0.96)_100%)]" />

        <div className="relative z-20 mx-auto w-full max-w-245">
          <div className="w-full overflow-hidden rounded-4xl border border-white/70 bg-white/88 shadow-[0_20px_55px_rgba(35,45,62,0.10)] backdrop-blur-xl">
            <div className="border-b border-[#e8edf3] px-6 py-5 md:px-8">
              <RegisterStepper step={step} />
            </div>

            <div className="px-6 py-6 md:px-8 md:py-8">
              <AnimatePresence mode="wait" initial={false}>
                {step === 1 ? (
                  <motion.div
                    key="register-step-1"
                    initial={{ opacity: 0, x: 18 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -18 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    <RegisterRoleStep
                      role={role}
                      onRoleChange={setRole}
                      onContinue={() => {
                        setStep(2);
                      }}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="register-step-2"
                    initial={{ opacity: 0, x: 18 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -18 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    <RegisterDetailsStep
                      locale={locale}
                      role={role}
                      fullName={fullName}
                      email={email}
                      password={password}
                      onFullNameChange={setFullName}
                      onEmailChange={setEmail}
                      onPasswordChange={setPassword}
                      onBack={() => {
                        setStep(1);
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
