"use server";

import { markCaseStudyCompleted } from "@/lib/eportfolio/queries";
import { createClient } from "@/lib/supabase/server";

type MarkCaseStudyCompletedInput = {
  slug: string;
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

export async function markCaseStudyCompletedAction(input: MarkCaseStudyCompletedInput) {
  const userId = await getAuthedUserId();

  const result = await markCaseStudyCompleted({
    userId,
    slug: input.slug,
  });

  if (!result) {
    throw new Error("Case study not found.");
  }

  return result;
}
