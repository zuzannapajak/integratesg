"use server";

import { completeScenarioAttempt, getScenarioLaunch } from "@/lib/scenarios/queries";
import { createClient } from "@/lib/supabase/server";

type MarkScenarioCompletedInput = {
  locale: string;
  scenarioSlug: string;
};

async function getAuthedUserId() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  return user.id;
}

export async function markScenarioCompletedAction(input: MarkScenarioCompletedInput) {
  const userId = await getAuthedUserId();

  await completeScenarioAttempt({
    locale: input.locale,
    userId,
    slug: input.scenarioSlug,
  });

  const scenario = await getScenarioLaunch({
    locale: input.locale,
    userId,
    slug: input.scenarioSlug,
  });

  if (!scenario) {
    throw new Error("Scenario not found.");
  }

  return { scenario };
}
