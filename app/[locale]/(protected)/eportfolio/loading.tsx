import ProtectedRouteState from "@/components/layout/protected-route-state";

export default function EportfolioLoading() {
  return <ProtectedRouteState scope="eportfolio" kind="loading" />;
}
