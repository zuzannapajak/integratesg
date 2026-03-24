import { APP_ROLES } from "@/lib/auth/roles";

export const APP_NAME = "IntegratESG Platform";

export const USER_ROLES = {
  EDUCATOR: APP_ROLES.educator,
  STUDENT: APP_ROLES.student,
  ADMIN: APP_ROLES.admin,
} as const;

export const ESG_AREAS = ["environmental", "social", "governance"] as const;
