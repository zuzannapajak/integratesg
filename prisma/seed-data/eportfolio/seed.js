import { caseStudies } from "./index.js";

async function upsertCaseStudy(prisma, caseStudyData) {
  const caseStudy = await prisma.caseStudy.upsert({
    where: {
      slug: caseStudyData.slug,
    },
    update: {
      area: caseStudyData.area,
      status: caseStudyData.status,
      sortOrder: caseStudyData.sortOrder,
      isFeatured: caseStudyData.isFeatured,
      countryCode: caseStudyData.countryCode,
      reportingPeriod: caseStudyData.reportingPeriod ?? null,
      sourcePartner: caseStudyData.sourcePartner ?? null,
    },
    create: {
      slug: caseStudyData.slug,
      area: caseStudyData.area,
      status: caseStudyData.status,
      sortOrder: caseStudyData.sortOrder,
      isFeatured: caseStudyData.isFeatured,
      countryCode: caseStudyData.countryCode,
      reportingPeriod: caseStudyData.reportingPeriod ?? null,
      sourcePartner: caseStudyData.sourcePartner ?? null,
    },
  });

  for (const translation of caseStudyData.translations) {
    await prisma.caseStudyTranslation.upsert({
      where: {
        caseStudyId_language: {
          caseStudyId: caseStudy.id,
          language: translation.language,
        },
      },
      update: {
        title: translation.title,
        summary: translation.summary ?? null,
        content: translation.content,
        keyTakeaways: translation.keyTakeaways ?? undefined,
        organization: translation.organization ?? null,
        industry: translation.industry ?? null,
      },
      create: {
        caseStudyId: caseStudy.id,
        language: translation.language,
        title: translation.title,
        summary: translation.summary ?? null,
        content: translation.content,
        keyTakeaways: translation.keyTakeaways ?? undefined,
        organization: translation.organization ?? null,
        industry: translation.industry ?? null,
      },
    });
  }

  return caseStudy;
}

export async function seedEportfolio(prisma) {
  for (const caseStudyData of caseStudies) {
    await upsertCaseStudy(prisma, caseStudyData);
  }

  console.log(`Seeded ePortfolio case studies: ${caseStudies.length}`);
}
