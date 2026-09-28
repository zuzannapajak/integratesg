"use client";

import ProtectedRouteState from "@/components/layout/protected-route-state";

type Props = {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
};

export default function EportfolioError({ reset }: Props) {
  return <ProtectedRouteState scope="eportfolio" kind="error" onRetry={reset} />;
}
