"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  value: number;
  suffix?: string;
  label: string;
};

export default function AnimatedStat({ value, suffix = "", label }: Props) {
  const [displayValue, setDisplayValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || hasAnimated) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        setHasAnimated(true);

        const duration = 2400;
        const startTime = performance.now();

        const tick = (now: number) => {
          const progress = Math.min((now - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 4);
          const current = Math.round(value * eased);

          setDisplayValue(current);

          if (progress < 1) {
            requestAnimationFrame(tick);
          }
        };

        requestAnimationFrame(tick);
        observer.disconnect();
      },
      {
        threshold: 0.45,
      },
    );

    observer.observe(node);

    return () => { observer.disconnect(); };
  }, [value, hasAnimated]);

  return (
    <div ref={ref} className="landing-metric-card">
      <span className="landing-metric-value">
        {displayValue}
        {suffix}
      </span>
      <span className="landing-metric-label">{label}</span>
    </div>
  );
}
