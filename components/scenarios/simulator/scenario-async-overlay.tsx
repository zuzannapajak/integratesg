"use client";

import { LoaderCircle } from "lucide-react";

export type ScenarioAsyncOverlayProps = {
  readonly visible: boolean;
  readonly message: string;
};

export function ScenarioAsyncOverlay({ visible, message }: ScenarioAsyncOverlayProps) {
  if (!visible) {
    return null;
  }

  return (
    <div
      data-testid="scenario-async-overlay"
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="absolute inset-0 z-50 flex items-center justify-center bg-white/75 p-4 backdrop-blur-[2px]"
    >
      <div className="flex max-w-sm items-center gap-3 rounded-2xl border border-[#dfe5ec] bg-white px-5 py-4 text-sm font-semibold text-[#31425a] shadow-[0_18px_50px_rgba(49,66,90,0.18)]">
        <LoaderCircle aria-hidden="true" className="h-5 w-5 shrink-0 animate-spin text-[#095fc8]" />

        <span>{message}</span>
      </div>
    </div>
  );
}
