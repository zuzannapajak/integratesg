export type DashboardRole = "educator" | "student" | "admin";

export type DashboardStat = {
  label: string;
  value: string;
};

export type DashboardChartPoint = {
  label: string;
  value: number;
};

export type DashboardMetric = {
  label: string;
  value: string;
};

export type DashboardKpi = {
  label: string;
  value: string;
  hint: string;
};

export type DashboardContinueItem = {
  title: string;
  description: string;
  href: string;
  badge: string;
  ctaLabel: string;
  kindLabel: string;
};

export type DashboardGamificationStat = {
  label: string;
  value: string;
  tone?: "accent" | "neutral" | "success";
};

export type RoleConfig = {
  accent: string;
  avatar: string;
  welcome: string;
  intro: string;
};
