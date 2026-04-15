import { APP_ROLES } from "@/lib/auth/roles";
import { APP_LOCALES } from "@/lib/i18n/locales";

export const APP_NAME = "IntegratESG Platform";

// Public
export const supportedLanguages: string[] = [...APP_LOCALES];

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
  LEARNER: APP_ROLES.learner,
  ADMIN: APP_ROLES.admin,
} as const;

export const ESG_AREAS = ["environmental", "social", "governance"] as const;

export const ESG_colors = {
  GREEN: "#1E9B73",
  BLUE: "#447FC1",
  ORANGE: "#D56F2D",
} as const;
