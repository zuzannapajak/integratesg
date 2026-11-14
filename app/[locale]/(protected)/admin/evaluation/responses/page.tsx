import { requireRole } from "@/features/auth/requireRole";
import { loadEvaluationResponseData } from "@/lib/admin/evaluation";
import {
  INDIVIDUAL_PAGE_SIZE,
  INDIVIDUAL_SURVEY_TYPES,
  buildIndividualResponses,
  filteredIndividualResponses,
  parseIndividualFilters,
} from "@/lib/admin/individual-evaluation";
import { APP_ROLES } from "@/lib/auth/roles";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export const dynamic = "force-dynamic";
type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function IndividualEvaluationPage({ params, searchParams }: Props) {
  const { locale } = await params;
  await requireRole(locale, APP_ROLES.admin);
  const search = await searchParams;
  const query = new URLSearchParams();
  for (const key of ["country", "survey", "group", "role", "page"] as const) {
    const raw = search[key];
    if (typeof raw === "string") query.set(key, raw);
  }
  const filters = parseIndividualFilters(query);
  const data = await loadEvaluationResponseData();
  const all = buildIndividualResponses(data);
  const filtered = filteredIndividualResponses(all, filters);
  const countries = [
    ...new Set(all.map((row) => row.countryCode).filter((code): code is string => code !== null)),
  ].sort();
  const pageCount = Math.max(1, Math.ceil(filtered.length / INDIVIDUAL_PAGE_SIZE));
  const page = Math.min(filters.page, pageCount);
  const rows = filtered.slice((page - 1) * INDIVIDUAL_PAGE_SIZE, page * INDIVIDUAL_PAGE_SIZE);
  const [t, evaluationT, wp4T, platformT] = await Promise.all([
    getTranslations({ locale, namespace: "Protected.IndividualEvaluation" }),
    getTranslations({ locale, namespace: "Protected.EvaluationAdmin" }),
    getTranslations({ locale, namespace: "Protected.Wp4Survey" }),
    getTranslations({ locale, namespace: "Protected.PlatformFeedbackForm" }),
  ]);
  const caseStudyLabels: Record<string, string> = {
    engagementEase: wp4T("caseStudies.engagementEase"),
    greenTransitionUnderstanding: wp4T("caseStudies.greenTransitionUnderstanding"),
    esgEcosystemUnderstanding: wp4T("caseStudies.esgEcosystemUnderstanding"),
    skills: wp4T("caseStudies.skills"),
    challenges: wp4T("caseStudies.challenges"),
    improvements: wp4T("caseStudies.improvements"),
  };
  const scenarioLabels: Record<string, string> = {
    incorporationEase: wp4T("scenarios.incorporationEase"),
    participantEngagement: wp4T("scenarios.participantEngagement"),
    skills: wp4T("scenarios.skills"),
    challenges: wp4T("scenarios.challenges"),
    implementationChallenges: wp4T("scenarios.implementationChallenges"),
    improvements: wp4T("scenarios.improvements"),
  };
  const platformLabels: Record<string, string> = {
    easeOfUse: platformT("questions.easeOfUse.label"),
    moduleClarity: platformT("questions.moduleClarity.label"),
    navigation: platformT("questions.navigation.label"),
    testsExperience: platformT("questions.testsExperience.label"),
    technicalProblems: platformT("questions.technicalProblems.label"),
    overallSatisfaction: platformT("questions.overallSatisfaction.label"),
    suggestions: platformT("openQuestions.suggestions.label"),
    technicalNotes: platformT("openQuestions.technicalNotes.label"),
  };
  const skillLabels: Record<string, string> = {
    systems_thinking: wp4T("skills.systems_thinking"),
    decision_making: wp4T("skills.decision_making"),
    data_literacy: wp4T("skills.data_literacy"),
  };
  const answerLabel = (surveyType: string, key: string) => {
    const labels =
      surveyType === "wp4_case_studies"
        ? caseStudyLabels
        : surveyType === "wp4_scenarios"
          ? scenarioLabels
          : platformLabels;
    return labels[key] ?? key;
  };
  const pageUrl = (next: number) => {
    const q = new URLSearchParams(query);
    q.set("page", String(next));
    return `/${locale}/admin/evaluation/responses?${q.toString()}`;
  };
  const exportQuery = new URLSearchParams(query);
  exportQuery.delete("page");

  return (
    <main className="min-h-screen bg-[#f5f5f3] px-4 py-10">
      <div className="mx-auto max-w-6xl space-y-5">
        <Link href={`/${locale}/admin/stats`} className="text-sm text-[#536174] hover:underline">
          ← {t("back")}
        </Link>
        <h1 className="text-3xl font-bold text-[#31425a]">{t("title")}</h1>
        <p className="text-sm text-[#536174]">{t("description")}</p>
        <form method="GET" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <label className="text-sm font-semibold text-[#31425a]">
            {t("country")}
            <select
              name="country"
              defaultValue={filters.country}
              className="mt-1 block w-full rounded-xl border border-slate-300 bg-white p-2"
            >
              <option value="all">{t("all")}</option>
              <option value="unknown">{t("unknown")}</option>
              {countries.map((country) => (
                <option value={country} key={country}>
                  {country}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-semibold text-[#31425a]">
            {t("survey")}
            <select
              name="survey"
              defaultValue={filters.survey}
              className="mt-1 block w-full rounded-xl border border-slate-300 bg-white p-2"
            >
              <option value="all">{t("all")}</option>
              {INDIVIDUAL_SURVEY_TYPES.map((type) => (
                <option key={type} value={type}>
                  {t(`surveyTypes.${type}`)}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-semibold text-[#31425a]">
            {t("group")}
            <select
              name="group"
              defaultValue={filters.group}
              className="mt-1 block w-full rounded-xl border border-slate-300 bg-white p-2"
            >
              <option value="all">{t("all")}</option>
              <option value="pilot">{evaluationT("group.pilot")}</option>
              <option value="standard">{evaluationT("group.standard")}</option>
            </select>
          </label>
          <label className="text-sm font-semibold text-[#31425a]">
            {t("role")}
            <select
              name="role"
              defaultValue={filters.role}
              className="mt-1 block w-full rounded-xl border border-slate-300 bg-white p-2"
            >
              <option value="all">{t("all")}</option>
              <option value="learner">{evaluationT("role.learner")}</option>
              <option value="educator">{evaluationT("role.educator")}</option>
            </select>
          </label>
          <button
            type="submit"
            className="self-end rounded-xl bg-[#31425a] px-4 py-2 text-sm font-semibold text-white"
          >
            {t("apply")}
          </button>
        </form>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p role="status" className="text-sm text-[#536174]">
            {t("count", { count: filtered.length, page, pages: pageCount })}
          </p>
          <div className="flex flex-wrap gap-2">
            <a
              href={`/${locale}/admin/evaluation/responses/export?${exportQuery.toString()}`}
              className="rounded-xl bg-[#31425a] px-4 py-2 text-sm font-semibold text-white"
            >
              {t("export")}
            </a>
            <a
              href={`/${locale}/admin/evaluation/responses/export?${exportQuery.toString()}&includeText=1`}
              className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-900"
            >
              {t("exportQualitative")}
            </a>
          </div>
        </div>
        <p className="text-xs text-amber-900">{t("privacyNote")}</p>
        {rows.length === 0 ? (
          <p className="rounded-xl bg-white p-5 text-[#536174]">{t("empty")}</p>
        ) : (
          <div className="overflow-x-auto rounded-2xl bg-white p-4 shadow-sm">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="border-b text-[#536174]">
                  <th className="p-3">{t("survey")}</th>
                  <th className="p-3">{t("date")}</th>
                  <th className="p-3">{t("country")}</th>
                  <th className="p-3">{t("group")}</th>
                  <th className="p-3">{t("role")}</th>
                  <th className="p-3">{t("details")}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.key} className="border-b border-slate-100 align-top">
                    <td className="p-3 font-semibold">{t(`surveyTypes.${row.surveyType}`)}</td>
                    <td className="whitespace-nowrap p-3">
                      {new Intl.DateTimeFormat(locale, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }).format(new Date(row.submittedAt))}
                    </td>
                    <td className="p-3">{row.countryCode ?? t("unknown")}</td>
                    <td className="p-3">{evaluationT(`group.${row.group}`)}</td>
                    <td className="p-3">{evaluationT(`role.${row.role}`)}</td>
                    <td className="p-3">
                      <details className="max-w-lg">
                        <summary className="cursor-pointer font-semibold text-[#31425a]">
                          {t("viewDetails")}
                        </summary>
                        <p className="mt-2 text-xs text-[#536174]">
                          {t("version")}: {row.surveyVersion} · {t("language")}:{" "}
                          {row.locale ?? t("unknown")} · {t("cohort")}: {row.cohortCode ?? "—"}
                        </p>
                        <p className="mt-3 font-semibold">{t("answers")}</p>
                        <dl>
                          {Object.entries(row.answers).map(([key, value]) => (
                            <div key={key} className="my-1 flex gap-2">
                              <dt className="font-medium">{answerLabel(row.surveyType, key)}:</dt>
                              <dd>
                                {Array.isArray(value)
                                  ? value.map((skill) => skillLabels[skill] ?? skill).join(", ")
                                  : value}
                              </dd>
                            </div>
                          ))}
                        </dl>
                        <p className="mt-3 font-semibold">{t("activity")}</p>
                        <dl>
                          {Object.entries(row.activity).map(([key, value]) => (
                            <div key={key} className="my-1 flex gap-2">
                              <dt className="font-medium">{key}:</dt>
                              <dd>{value}</dd>
                            </div>
                          ))}
                        </dl>
                        {Object.keys(row.qualitative).length > 0 && (
                          <>
                            <p className="mt-3 font-semibold text-amber-900">{t("qualitative")}</p>
                            <dl>
                              {Object.entries(row.qualitative).map(([key, value]) => (
                                <div key={key} className="my-2">
                                  <dt className="font-medium">
                                    {answerLabel(row.surveyType, key)}
                                  </dt>
                                  <dd className="whitespace-pre-wrap break-words">{value}</dd>
                                </div>
                              ))}
                            </dl>
                          </>
                        )}
                      </details>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <nav
          aria-label={t("pagination")}
          className="flex justify-between text-sm font-semibold text-[#31425a]"
        >
          {page > 1 ? <Link href={pageUrl(page - 1)}>{t("previous")}</Link> : <span />}
          {page < pageCount ? <Link href={pageUrl(page + 1)}>{t("next")}</Link> : <span />}
        </nav>
      </div>
    </main>
  );
}
