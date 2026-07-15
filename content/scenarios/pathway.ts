import type { ScenarioPathwayDefinition } from "@/components/scenarios/pathway/scenario-pathway-types";
import type { ScenarioPathwayAssets } from "@/lib/scenarios/simulator/types";

export const scenarioPathwayAssets = {
  backgroundImage: "/scenarios/pathway/pathway.png",
} satisfies ScenarioPathwayAssets;

/**
 * Static pathway metadata only.
 *
 * User-specific statuses are resolved on the server from UserScenarioAttempt
 * records and must not be stored in this content file.
 */
export const scenarioPathwayDefinitions = [
  {
    id: "scenario-01",
    slug: "scenario-01",
    order: 1,
    title: "Introduction to ESG and Sustainable Development",
    shortTitle: "Foundations of ESG",

    position: {
      x: 14,
      y: 54,
      labelSide: "bottom",
    },
  },

  {
    id: "scenario-02",
    slug: "scenario-02",
    order: 2,
    title: "Strategy, Vision and Organisational Alignment",
    shortTitle: "Strategy & Alignment",

    position: {
      x: 37,
      y: 40,
      labelSide: "bottom",
    },
  },

  {
    id: "scenario-03",
    slug: "scenario-03",
    order: 3,
    title: "Navigating ESG Frameworks and EU Reporting Standards",
    shortTitle: "Reporting Standards",

    position: {
      x: 49,
      y: 74,
      labelSide: "bottom",
    },
  },

  {
    id: "scenario-04",
    slug: "scenario-04",
    order: 4,
    title: "Integrating ESG into Business Operations",
    shortTitle: "ESG in Operations",

    position: {
      x: 66,
      y: 35,
      labelSide: "bottom",
    },
  },

  {
    id: "scenario-05",
    slug: "scenario-05",
    order: 5,
    title: "Implementation, Data and Cross-Functional Practice",
    shortTitle: "Cross-Functional Practice",

    position: {
      x: 78,
      y: 58,
      labelSide: "bottom",
    },
  },

  {
    id: "scenario-06",
    slug: "scenario-06",
    order: 6,
    title: "Monitoring, Reporting and Future Trends of ESG",
    shortTitle: "Monitoring & Reporting",

    position: {
      x: 30,
      y: 74,
      labelSide: "bottom",
    },
  },
] satisfies readonly ScenarioPathwayDefinition[];

/**
 * Backward-compatible metadata alias used by dashboard and admin reporting.
 * It intentionally contains no user progress status.
 */
export const scenarioPathwayItems = scenarioPathwayDefinitions;
