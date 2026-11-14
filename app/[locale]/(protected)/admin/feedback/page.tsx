import GeneralFeedbackDeleteButton from "@/components/platform-feedback/general-feedback-delete-button";
import { requireRole } from "@/features/auth/requireRole";
import {
  getGeneralFeedbackAdminPage,
  parseGeneralFeedbackFilters,
} from "@/lib/admin/general-feedback";
import { APP_ROLES } from "@/lib/auth/roles";
import { GENERAL_FEEDBACK_CATEGORIES } from "@/lib/platform-feedback/general-definition";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminGeneralFeedbackPage({ params, searchParams }: Props) {
  const { locale } = await params;
  await requireRole(locale, APP_ROLES.admin);
  const search = await searchParams;
  const url = new URLSearchParams();
  if (typeof search.category === "string") url.set("category", search.category);
  if (typeof search.page === "string") url.set("page", search.page);
  const filters = parseGeneralFeedbackFilters(url);
  const [data, t] = await Promise.all([
    getGeneralFeedbackAdminPage(filters),
    getTranslations({ locale, namespace: "Protected.GeneralFeedbackAdmin" }),
  ]);
  const linkToPage = (page: number) => {
    const next = new URLSearchParams();
    if (data.category !== "all") next.set("category", data.category);
    next.set("page", String(page));
    return `/${locale}/admin/feedback?${next.toString()}`;
  };

  return (
    <main className="min-h-screen bg-[#f5f5f3] px-4 py-10">
      <div className="mx-auto max-w-6xl space-y-5">
        <Link href={`/${locale}/admin/stats`} className="text-sm text-[#536174] hover:underline">
          ← {t("backToStats")}
        </Link>
        <h1 className="text-3xl font-bold text-[#31425a]">{t("title")}</h1>
        <p className="text-sm text-[#536174]">{t("privacyReminder")}</p>
        <form method="GET" className="flex flex-wrap items-end gap-3">
          <label className="text-sm font-semibold text-[#31425a]">
            {t("filterCategory")}
            <select
              name="category"
              defaultValue={data.category}
              className="mt-1 block rounded-xl border border-slate-300 bg-white px-3 py-2"
            >
              <option value="all">{t("allCategories")}</option>
              {GENERAL_FEEDBACK_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {t(`categories.${category}`)}
                </option>
              ))}
            </select>
          </label>
          <button
            type="submit"
            className="rounded-xl bg-[#31425a] px-4 py-2 text-sm font-semibold text-white"
          >
            {t("filter")}
          </button>
        </form>
        <p className="text-sm text-[#536174]" role="status">
          {t("pageCount", { count: data.total, page: data.page, pages: data.pageCount })}
        </p>
        {data.rows.length === 0 ? (
          <p className="rounded-2xl bg-white p-6 text-[#536174]">{t("empty")}</p>
        ) : (
          <div className="overflow-x-auto rounded-2xl bg-white p-4 shadow-sm">
            <table className="w-full min-w-[740px] text-left text-sm">
              <thead>
                <tr className="border-b text-[#536174]">
                  <th className="p-3">{t("columns.date")}</th>
                  <th className="p-3">{t("columns.category")}</th>
                  <th className="p-3">{t("columns.context")}</th>
                  <th className="p-3">{t("columns.message")}</th>
                  <th className="p-3">{t("columns.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {data.rows.map((row) => (
                  <tr key={row.id} className="border-b border-slate-100 align-top">
                    <td className="whitespace-nowrap p-3">
                      {new Intl.DateTimeFormat(locale, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }).format(new Date(row.submittedAt))}
                    </td>
                    <td className="p-3">{t(`categories.${row.category}`)}</td>
                    <td className="p-3">
                      {row.role} · {row.locale}
                    </td>
                    <td className="max-w-lg whitespace-pre-wrap break-words p-3">{row.message}</td>
                    <td className="p-3">
                      <GeneralFeedbackDeleteButton id={row.id} locale={locale} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <nav
          aria-label={t("pagination")}
          className="flex justify-between gap-4 text-sm font-semibold text-[#31425a]"
        >
          {data.page > 1 ? <Link href={linkToPage(data.page - 1)}>{t("previous")}</Link> : <span />}
          {data.page < data.pageCount ? (
            <Link href={linkToPage(data.page + 1)}>{t("next")}</Link>
          ) : (
            <span />
          )}
        </nav>
      </div>
    </main>
  );
}
