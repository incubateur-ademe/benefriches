import { describe, expect, it } from "vitest";

import { creationProjectFormUrbanActions } from "../../../urbanProject.actions";
import { mockSiteData } from "../../_siteData.mock";
import { getCurrentStep, StoreBuilder } from "../../_testStoreHelpers";

const { previousStepRequested } = creationProjectFormUrbanActions;

describe("Urban project creation - Steps - Site resale introduction navigation", () => {
  it("goes back to the reinstatement contract owner on a friche involving reinstatement", () => {
    // Arrange
    const store = new StoreBuilder()
      .withSiteData({ ...mockSiteData, nature: "FRICHE" })
      .withSteps({
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["RESIDENTIAL"] },
        },
        URBAN_PROJECT_INVOLVES_REINSTATEMENT: {
          completed: true,
          payload: { involvesReinstatement: true },
        },
      })
      .withCurrentStep("URBAN_PROJECT_SITE_RESALE_INTRODUCTION")
      .build();

    // Act
    store.dispatch(previousStepRequested());

    // Assert
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER");
  });

  it("goes back to the buildings developer on a non-friche site with new construction", () => {
    // Arrange
    const store = new StoreBuilder()
      .withSiteData({ nature: "AGRICULTURAL_OPERATION" })
      .withSteps({
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["RESIDENTIAL"] },
        },
        URBAN_PROJECT_SPACES_SURFACE_AREA: {
          completed: true,
          payload: {
            spacesSurfaceAreaDistribution: { BUILDINGS: 3000, IMPERMEABLE_SOILS: 7000 },
          },
        },
        URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE: {
          completed: true,
          payload: { buildingsFootprintToReuse: 1000 },
        },
      })
      .withCurrentStep("URBAN_PROJECT_SITE_RESALE_INTRODUCTION")
      .build();

    // Act
    store.dispatch(previousStepRequested());

    // Assert
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER");
  });

  it("goes back to the project developer on a non-friche site without new construction", () => {
    // Arrange
    const store = new StoreBuilder()
      .withSiteData({ nature: "AGRICULTURAL_OPERATION" })
      .withSteps({
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["PUBLIC_GREEN_SPACES"] },
        },
      })
      .withCurrentStep("URBAN_PROJECT_SITE_RESALE_INTRODUCTION")
      .build();

    // Act
    store.dispatch(previousStepRequested());

    // Assert
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER");
  });

  it("goes back to the project developer on a friche not involving reinstatement", () => {
    // Arrange — no new construction
    const store = new StoreBuilder()
      .withSiteData({ ...mockSiteData, nature: "FRICHE" })
      .withSteps({
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["PUBLIC_GREEN_SPACES"] },
        },
        URBAN_PROJECT_INVOLVES_REINSTATEMENT: {
          completed: true,
          payload: { involvesReinstatement: false },
        },
      })
      .withCurrentStep("URBAN_PROJECT_SITE_RESALE_INTRODUCTION")
      .build();

    // Act
    store.dispatch(previousStepRequested());

    // Assert
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER");
  });
});
