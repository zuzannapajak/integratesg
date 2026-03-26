"use client";

import { useId } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type ChartPoint = {
  label: string;
  value: number;
};

type Props = {
  accentColor: string;
  data: ChartPoint[];
  height?: number;
  valueLabel?: string;
};

export default function StatsChart({
  accentColor,
  data,
  height = 240,
  valueLabel = "Activity",
}: Props) {
  const gradientId = useId();

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={accentColor} stopOpacity={0.18} />
              <stop offset="95%" stopColor={accentColor} stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e8edf3" />

          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#97a2b1", fontSize: 12 }}
            dy={10}
          />

          <YAxis hide />

          <Tooltip
            cursor={{ stroke: "#dbe3ea", strokeDasharray: "3 3" }}
            contentStyle={{
              borderRadius: "16px",
              border: "1px solid #e8edf3",
              boxShadow: "0 12px 24px rgba(35,45,62,0.08)",
              background: "rgba(255,255,255,0.98)",
              backdropFilter: "blur(10px)",
            }}
            labelStyle={{ color: "#667180", fontWeight: 600 }}
            formatter={(value) => [value ?? 0, valueLabel]}
          />

          <Area
            type="monotone"
            dataKey="value"
            stroke={accentColor}
            strokeWidth={3}
            fill={`url(#${gradientId})`}
            activeDot={{
              r: 5,
              fill: accentColor,
              strokeWidth: 0,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
