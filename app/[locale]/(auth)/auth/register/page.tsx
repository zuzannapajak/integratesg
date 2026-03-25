import RegisterClientPage from "./register-client-page";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function RegisterPage({ params }: Props) {
  const { locale } = await params;

  return <RegisterClientPage locale={locale} />;
}
