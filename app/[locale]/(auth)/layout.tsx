import PublicNavbar from "@/components/layout/public-navbar";
import BackgroundMasks from "@/components/ui/background-masks";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function AuthLayout({ children, params }: Props) {
  const { locale } = await params;

  return (
    <div className="grid h-dvh grid-rows-[auto_1fr] overflow-hidden bg-[#f5f5f3]">
      <BackgroundMasks />
      <PublicNavbar locale={locale} forceCompact forceSolid />
      <div className="min-h-0 overflow-hidden">{children}</div>
    </div>
  );
}
