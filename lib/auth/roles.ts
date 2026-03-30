export const APP_ROLES = {
  student: "student",
  educator: "educator",
  admin: "admin",
} as const;

export type AppRole = (typeof APP_ROLES)[keyof typeof APP_ROLES];
export type SelfServiceRole = typeof APP_ROLES.student | typeof APP_ROLES.educator;

export const SELF_SERVICE_ROLES = [APP_ROLES.student, APP_ROLES.educator] as const;

export const ROLE_LABELS: Record<AppRole, string> = {
  [APP_ROLES.student]: "Student",
  [APP_ROLES.educator]: "Educator",
  [APP_ROLES.admin]: "Admin",
};

export function isSelfServiceRole(role: string): role is SelfServiceRole {
  return SELF_SERVICE_ROLES.includes(role as SelfServiceRole);
}

export function canAccessCurriculum(role: AppRole) {
  return role === APP_ROLES.educator;
}

export function canAccessStats(role: AppRole) {
  return role === APP_ROLES.admin;
}

export function getDefaultProtectedRoute(locale: string, role: AppRole) {
  if (canAccessStats(role)) {
    return `/${locale}/admin/stats`;
  }

  if (canAccessCurriculum(role)) {
    return `/${locale}/curriculum`;
  }

  return `/${locale}/dashboard`;
}
