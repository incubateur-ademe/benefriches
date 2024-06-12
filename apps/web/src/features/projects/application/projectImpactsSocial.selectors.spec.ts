import { projectImpactMock } from "./projectImpacts.mock";
import { getSocialProjectImpacts } from "./projectImpactsSocial.selectors";

import { RootState } from "@/app/application/store";

const MOCK_STATES = {
  projectImpacts: {
    dataLoadingState: "success",
    evaluationPeriod: 10,
    currentViewMode: "list",
    currentCategoryFilter: "all",
    impactsData: projectImpactMock.impacts,
    projectData: {
      id: projectImpactMock.id,
      name: projectImpactMock.name,
      ...projectImpactMock.projectData,
    },
    relatedSiteData: {
      id: projectImpactMock.relatedSiteId,
      name: projectImpactMock.relatedSiteName,
      ...projectImpactMock.siteData,
    },
  } satisfies RootState["projectImpacts"],
};

describe("projectImpactsSocial selectors", () => {
  describe("getSocialProjectImpacts", () => {
    it.each([{ filter: "all" }, { filter: "social" }])(
      "should return social formatted with details and total for filter $filter",
      ({ filter }) => {
        const impacts = getSocialProjectImpacts.resultFunc(
          filter as "social" | "all",
          MOCK_STATES.projectImpacts["impactsData"],
        );

        expect(impacts).toContainEqual(
          expect.objectContaining({
            name: "full_time_jobs",
            type: "default",
            impact: {
              base: 1,
              forecast: 3.5,
              difference: 2.5,
              details: [
                {
                  impact: { base: 0, difference: 3, forecast: 3 },
                  name: "conversion_full_time_jobs",
                },
                {
                  impact: { base: 1, difference: -0.5, forecast: 0.5 },
                  name: "operations_full_time_jobs",
                },
              ],
            },
          }),
        );

        expect(impacts).toContainEqual(
          expect.objectContaining({
            name: "avoided_accidents",
            type: "default",
            impact: {
              base: 0,
              difference: 3,
              forecast: 3,
              details: [
                {
                  impact: { base: 0, difference: 1, forecast: 1 },
                  name: "avoided_minor_accidents",
                },
                {
                  impact: { base: 0, difference: 2, forecast: 2 },
                  name: "avoided_severe_accidents",
                },
              ],
            },
          }),
        );

        expect(impacts).toContainEqual(
          expect.objectContaining({
            name: "households_powered_by_renewable_energy",
            type: "default",
            impact: {
              base: 0,
              difference: 1000,
              forecast: 1000,
            },
          }),
        );
      },
    );
    it.each([{ filter: "economic" }, { filter: "environment" }])(
      "should return empty social impacts for filter $filter",
      ({ filter }) => {
        const impacts = getSocialProjectImpacts.resultFunc(
          filter as "economic" | "environment",
          MOCK_STATES.projectImpacts["impactsData"],
        );

        expect(impacts.length).toEqual(0);
      },
    );
  });
});
