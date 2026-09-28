import ProtectedRouteState from "@/components/layout/protected-route-state";

export default function DashboardLoading() {
  return <ProtectedRouteState scope="dashboard" kind="loading" />;
}
