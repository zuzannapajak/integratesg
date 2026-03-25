import PublicNavbar from "@/components/layout/public-navbar";
import BackgroundMasks from "@/components/ui/background-masks";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function AuthLayout({ children, params }: Props) {
  const { locale } = await params;

  return (
    <div className="min-h-dvh bg-[#f5f5f3]">
      <BackgroundMasks />
      <div className="grid min-h-dvh grid-rows-[auto_1fr]">
        <PublicNavbar locale={locale} forceCompact forceSolid />
        <div>{children}</div>
      </div>
    </div>
  );
}
