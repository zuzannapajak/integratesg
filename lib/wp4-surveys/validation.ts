import { z } from "zod";
import { WP4_SKILLS } from "@/lib/wp4-surveys/definition";

const rating = z.number().int().min(1).max(5);
const requiredText = z.string().trim().min(1).max(2000);
const selectedSkills = z
  .array(z.enum(WP4_SKILLS))
  .min(1)
  .max(WP4_SKILLS.length)
  .refine((values) => new Set(values).size === values.length, "DUPLICATE_SKILL");

export const wp4SurveySchema = z.discriminatedUnion("scope", [
  z.strictObject({
    scope: z.literal("case-studies"),
    locale: z.enum(["en", "it", "de", "el", "pl", "bg"]),
    engagementEase: rating,
    greenTransitionUnderstanding: rating,
    esgEcosystemUnderstanding: rating,
    skills: selectedSkills,
    challenges: requiredText,
    improvements: requiredText,
  }),
  z.strictObject({
    scope: z.literal("scenarios"),
    locale: z.enum(["en", "it", "de", "el", "pl", "bg"]),
    incorporationEase: rating,
    participantEngagement: rating,
    skills: selectedSkills,
    challenges: requiredText,
    implementationChallenges: requiredText,
    improvements: requiredText,
  }),
]);

export type Wp4SurveyInput = z.infer<typeof wp4SurveySchema>;

export function normalizeWp4SurveyInput(input: unknown): Wp4SurveyInput {
  const result = wp4SurveySchema.safeParse(input);
  if (!result.success) throw new Error("INVALID_WP4_SURVEY");
  return result.data;
}
