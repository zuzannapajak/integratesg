"use client";

import ProtectedRouteState from "@/components/layout/protected-route-state";

type Props = {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
};

export default function DashboardError({ reset }: Props) {
  return <ProtectedRouteState scope="dashboard" kind="error" onRetry={reset} />;
}
