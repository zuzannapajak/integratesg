"use client";

import ProtectedRouteState from "@/components/layout/protected-route-state";

type Props = {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
};

export default function LocalizedError({ reset }: Props) {
  return <ProtectedRouteState scope="application" kind="error" onRetry={reset} />;
}
