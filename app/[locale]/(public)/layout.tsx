import PublicNavbar from "@/components/layout/public-navbar";
import BackgroundMasks from "@/components/ui/background-masks";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function PublicLayout({ children, params }: Props) {
  const { locale } = await params;

  return (
    <div className="min-h-screen bg-[#f5f5f3]">
      <BackgroundMasks />
      <PublicNavbar locale={locale} />
      {children}
    </div>
  );
}
