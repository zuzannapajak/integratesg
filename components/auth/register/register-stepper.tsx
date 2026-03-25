"use client";

import { Check } from "lucide-react";

type Step = 1 | 2;

type Props = {
  step: Step;
};

const steps = [
  { id: 1 as const, label: "Role" },
  { id: 2 as const, label: "Account details" },
];

export default function RegisterStepper({ step }: Props) {
  return (
    <div className="w-full">
      <div className="flex items-center">
        {steps.map((item, index) => {
          const isCompleted = step > item.id;
          const isActive = step === item.id;

          return (
            <div key={item.id} className="flex min-w-0 flex-1 items-center">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[0.78rem] font-semibold transition-all duration-200 ${
                    isCompleted
                      ? "border-[#6fb79e] bg-[#6fb79e] text-white"
                      : isActive
                        ? "border-[#6fb79e] bg-white text-[#3c4a5f]"
                        : "border-[#9acbb9] bg-white text-[#7c8a9c]"
                  }`}
                >
                  {isCompleted ? <Check className="h-3.5 w-3.5" /> : item.id}
                </div>

                <span
                  className={`truncate text-[0.9rem] ${
                    isCompleted || isActive ? "text-[#3c4a5f]" : "text-[#8b96a5]"
                  }`}
                >
                  {item.label}
                </span>
              </div>

              {index < steps.length - 1 ? <div className="mx-4 h-px flex-1 bg-[#9fd0bd]" /> : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
