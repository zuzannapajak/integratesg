import { APP_ROLES } from "@/lib/auth/roles";

export const APP_NAME = "IntegratESG Platform";

// Public
export const FOCUS_CARD = [
  {
    eyebrow: "For students",
    title: "Scenario Simulator",
    description:
      "Explore ESG topics through interactive decision-making scenarios and practical learning paths.",
  },
  {
    eyebrow: "For educators",
    title: "Curriculum and self-assessment",
    description:
      "Access structured learning modules, pre- and post-quizzes, and feedback-driven teaching resources.",
  },
  {
    eyebrow: "For all users",
    title: "ePortfolio of case studies",
    description:
      "Review standardized ESG case studies prepared across partner languages and contexts.",
  },
];

export const PARTNERS = [
  { name: "Lodz University of Technology", src: "/images/partners/lodz_logo.png" },
  { name: "SBC", src: "/images/partners/sbc_logo.png" },
  { name: "Egina", src: "/images/partners/egina_logo.png" },
  { name: "Institute of Development N. Charalambous", src: "/images/partners/iod_logo.png" },
  { name: "dieBerater", src: "/images/partners/dieberater_logo.png" },
  { name: "CleverMind", src: "/images/partners/clever_mind_logo.png" },
];

// Protected
export const USER_ROLES = {
  EDUCATOR: APP_ROLES.educator,
  STUDENT: APP_ROLES.student,
  ADMIN: APP_ROLES.admin,
} as const;

export const ESG_AREAS = ["environmental", "social", "governance"] as const;

export const ESG_colors = {
  GREEN: "#1E9B73",
  BLUE: "#447FC1",
  ORANGE: "#D56F2D",
} as const;
