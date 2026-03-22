import PublicNavbar from "@/components/layout/public-navbar";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function PublicLayout({ children, params }: Props) {
  const { locale } = await params;

  return (
    <div className="min-h-screen">
      <PublicNavbar locale={locale} />
      {children}
    </div>
  );
}
