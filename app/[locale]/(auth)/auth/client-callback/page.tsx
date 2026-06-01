import ClientAuthCallback from "./client-auth-callback";

type Props = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function ClientCallbackPage({ params }: Props) {
  const { locale } = await params;

  return <ClientAuthCallback locale={locale} />;
}
