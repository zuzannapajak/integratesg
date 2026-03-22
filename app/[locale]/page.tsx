import { useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations("HomePage");

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">{t("title")}</h1>
    </main>
  );
}
