"use client";

import { CurriculumErrorState } from "@/components/curriculum/curriculum-route-state";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function CurriculumError({ reset }: Props) {
  return <CurriculumErrorState onRetry={reset} />;
}
