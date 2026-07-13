import { test } from "./fixtures";

const PROJECT_NAME = "Centrale photovoltaïque de Meylan";

test.describe("photovoltaic project creation - custom mode", () => {
  test("allows authenticated user to create a photovoltaic power station via custom mode", async ({
    pvProjectCreationPage,
    agriculturalSite,
  }) => {
    // Navigate to project creation
    await pvProjectCreationPage.goto(agriculturalSite.id);

    // --- Project phase ---
    await pvProjectCreationPage.selectProjectPhase("Montage / Développement");

    // Create mode selection
    await pvProjectCreationPage.selectCreateMode("custom");

    // Project type selection
    await pvProjectCreationPage.selectProjectType();

    // Renewable energy type selection
    await pvProjectCreationPage.selectRenewableEnergyType();

    // --- Photovoltaic parameters ---

    // Key parameter: power
    await pvProjectCreationPage.selectKeyParameter("POWER");

    // Electrical power: 296 kWc
    await pvProjectCreationPage.fillPower(296);

    // Surface area: 2700 m² (within suitable surface to avoid non-suitable soils path)
    await pvProjectCreationPage.fillSurface(2700);

    // Expected annual production: 374 MWh
    await pvProjectCreationPage.fillExpectedAnnualProduction(374);

    // Contract duration: 20 years
    await pvProjectCreationPage.fillContractDuration(20);

    // --- Soils transformation ---

    // Soils transformation introduction
    await pvProjectCreationPage.goToNextStep();

    // Soils transformation project selection: keep current soils
    await pvProjectCreationPage.selectSoilsTransformationProject("keepCurrentSoils");

    // Soils summary
    await pvProjectCreationPage.expectSoilsSummaryStep();
    await pvProjectCreationPage.goToNextStep();

    // Soils carbon storage
    await pvProjectCreationPage.expectSoilsCarbonStorageStep();
    await pvProjectCreationPage.goToNextStep();

    // --- Stakeholders ---

    // Stakeholders introduction
    await pvProjectCreationPage.goToNextStep();

    // Developer: select user's own structure
    await pvProjectCreationPage.selectStakeholder(/Ma structure/);

    // Future operator: select user's own structure
    await pvProjectCreationPage.selectStakeholder(/Ma structure/);

    // Site purchase: no
    await pvProjectCreationPage.selectSitePurchase(false);

    // --- Expenses ---

    // Expenses introduction
    await pvProjectCreationPage.goToNextStep();

    // PV installation expenses: accept pre-filled defaults
    await pvProjectCreationPage.submitOrSkipStep();

    // Yearly projected expenses: accept pre-filled defaults
    await pvProjectCreationPage.submitOrSkipStep();

    // --- Revenue ---

    // Revenue introduction
    await pvProjectCreationPage.goToNextStep();

    // Yearly projected revenue: accept pre-filled defaults
    await pvProjectCreationPage.submitOrSkipStep();

    // Financial assistance: skip or accept defaults
    await pvProjectCreationPage.submitOrSkipStep();

    // --- Schedule ---

    // Start: September 2027 (18 months from March 2026)
    // End: March 2029 (3 years from March 2026)
    // First year of operation: 2029
    await pvProjectCreationPage.fillSchedule("09/2027", "03/2029", 2029);

    // --- Name and description ---

    await pvProjectCreationPage.fillNameAndDescription(PROJECT_NAME);

    // --- Final summary ---

    await pvProjectCreationPage.expectFinalSummary();
    await pvProjectCreationPage.submitFinalSummary();

    // --- Creation result ---

    await pvProjectCreationPage.expectCreationSuccess(PROJECT_NAME);
  });
});

test.describe("photovoltaic project creation - friche site", () => {
  const FRICHE_PROJECT_NAME = "Centrale photovoltaïque sur friche de Meylan";

  test("allows authenticated user to create a PV project on a friche site", async ({
    pvProjectCreationPage,
    fricheSite,
  }) => {
    // Navigate to project creation
    await pvProjectCreationPage.goto(fricheSite.id);

    // --- Project phase ---
    await pvProjectCreationPage.selectProjectPhase("Montage / Développement");

    // Create mode selection
    await pvProjectCreationPage.selectCreateMode("custom");

    // Project type selection
    await pvProjectCreationPage.selectProjectType();

    // Renewable energy type selection
    await pvProjectCreationPage.selectRenewableEnergyType();

    // --- Photovoltaic parameters ---

    await pvProjectCreationPage.selectKeyParameter("POWER");
    await pvProjectCreationPage.fillPower(296);
    await pvProjectCreationPage.fillSurface(2700);
    await pvProjectCreationPage.fillExpectedAnnualProduction(374);
    await pvProjectCreationPage.fillContractDuration(20);

    // --- Soils decontamination ---

    // Involves reinstatement: no
    await pvProjectCreationPage.selectInvolvesReinstatement(false);

    // Decontamination introduction
    await pvProjectCreationPage.goToNextStep();

    // Decontamination selection: no decontamination
    await pvProjectCreationPage.selectDecontaminationOption("none");

    // --- Soils transformation ---

    // Soils transformation introduction
    await pvProjectCreationPage.goToNextStep();

    // Soils transformation project selection: keep current soils
    await pvProjectCreationPage.selectSoilsTransformationProject("keepCurrentSoils");

    // Soils summary
    await pvProjectCreationPage.expectSoilsSummaryStep();
    await pvProjectCreationPage.goToNextStep();

    // Soils carbon storage
    await pvProjectCreationPage.expectSoilsCarbonStorageStep();
    await pvProjectCreationPage.goToNextStep();

    // --- Stakeholders ---

    // Stakeholders introduction
    await pvProjectCreationPage.goToNextStep();

    // Developer: select user's own structure
    await pvProjectCreationPage.selectStakeholder(/Ma structure/);

    // Future operator: select user's own structure
    await pvProjectCreationPage.selectStakeholder(/Ma structure/);

    // Site purchase: no
    await pvProjectCreationPage.selectSitePurchase(false);

    // --- Expenses ---

    // Expenses introduction
    await pvProjectCreationPage.goToNextStep();

    // PV installation expenses: accept pre-filled defaults
    await pvProjectCreationPage.submitOrSkipStep();

    // Yearly projected expenses: accept pre-filled defaults
    await pvProjectCreationPage.submitOrSkipStep();

    // --- Revenue ---

    // Revenue introduction
    await pvProjectCreationPage.goToNextStep();

    // Yearly projected revenue: accept pre-filled defaults
    await pvProjectCreationPage.submitOrSkipStep();

    // Financial assistance: skip or accept defaults
    await pvProjectCreationPage.submitOrSkipStep();

    // --- Schedule ---

    await pvProjectCreationPage.fillSchedule("09/2027", "03/2029", 2029);

    // --- Name and description ---

    await pvProjectCreationPage.fillNameAndDescription(FRICHE_PROJECT_NAME);

    // --- Final summary ---

    await pvProjectCreationPage.expectFinalSummary();
    await pvProjectCreationPage.submitFinalSummary();

    // --- Creation result ---

    await pvProjectCreationPage.expectCreationSuccess(FRICHE_PROJECT_NAME);
  });
});

test.describe("photovoltaic project creation - custom mode driven by surface", () => {
  const SURFACE_PROJECT_NAME = "Centrale photovoltaïque par superficie de Meylan";

  test("allows authenticated user to create a photovoltaic power station keyed on surface", async ({
    pvProjectCreationPage,
    agriculturalSite,
  }) => {
    // Navigate to project creation
    await pvProjectCreationPage.goto(agriculturalSite.id);

    // --- Project phase ---
    await pvProjectCreationPage.selectProjectPhase("Montage / Développement");

    // Create mode selection
    await pvProjectCreationPage.selectCreateMode("custom");

    // Project type selection
    await pvProjectCreationPage.selectProjectType();

    // Renewable energy type selection
    await pvProjectCreationPage.selectRenewableEnergyType();

    // --- Photovoltaic parameters (surface-driven order: surface → power) ---

    // Key parameter: surface
    await pvProjectCreationPage.selectKeyParameter("SURFACE");

    // Surface area: 2700 m² (within suitable surface to avoid non-suitable soils path)
    await pvProjectCreationPage.fillSurface(2700);

    // Electrical power: 296 kWc
    await pvProjectCreationPage.fillPower(296);

    // Expected annual production: 374 MWh
    await pvProjectCreationPage.fillExpectedAnnualProduction(374);

    // Contract duration: 20 years
    await pvProjectCreationPage.fillContractDuration(20);

    // --- Soils transformation ---

    // Soils transformation introduction
    await pvProjectCreationPage.goToNextStep();

    // Soils transformation project selection: keep current soils
    await pvProjectCreationPage.selectSoilsTransformationProject("keepCurrentSoils");

    // Soils summary
    await pvProjectCreationPage.expectSoilsSummaryStep();
    await pvProjectCreationPage.goToNextStep();

    // Soils carbon storage
    await pvProjectCreationPage.expectSoilsCarbonStorageStep();
    await pvProjectCreationPage.goToNextStep();

    // --- Stakeholders ---

    // Stakeholders introduction
    await pvProjectCreationPage.goToNextStep();

    // Developer: select user's own structure
    await pvProjectCreationPage.selectStakeholder(/Ma structure/);

    // Future operator: select user's own structure
    await pvProjectCreationPage.selectStakeholder(/Ma structure/);

    // Site purchase: no
    await pvProjectCreationPage.selectSitePurchase(false);

    // --- Expenses ---

    // Expenses introduction
    await pvProjectCreationPage.goToNextStep();

    // PV installation expenses: accept pre-filled defaults
    await pvProjectCreationPage.submitOrSkipStep();

    // Yearly projected expenses: accept pre-filled defaults
    await pvProjectCreationPage.submitOrSkipStep();

    // --- Revenue ---

    // Revenue introduction
    await pvProjectCreationPage.goToNextStep();

    // Yearly projected revenue: accept pre-filled defaults
    await pvProjectCreationPage.submitOrSkipStep();

    // Financial assistance: skip or accept defaults
    await pvProjectCreationPage.submitOrSkipStep();

    // --- Schedule ---

    await pvProjectCreationPage.fillSchedule("09/2027", "03/2029", 2029);

    // --- Name and description ---

    await pvProjectCreationPage.fillNameAndDescription(SURFACE_PROJECT_NAME);

    // --- Final summary ---

    await pvProjectCreationPage.expectFinalSummary();
    await pvProjectCreationPage.submitFinalSummary();

    // --- Creation result ---

    await pvProjectCreationPage.expectCreationSuccess(SURFACE_PROJECT_NAME);
  });
});

test.describe("photovoltaic project creation - demo mode", () => {
  test("allows authenticated user to create a photovoltaic power station via express mode", async ({
    pvProjectCreationPage,
    agriculturalSite,
  }) => {
    // Navigate to project creation with the test site
    await pvProjectCreationPage.goto(agriculturalSite.id);

    // --- Project phase ---
    await pvProjectCreationPage.selectProjectPhase("Montage / Développement");

    // Create mode selection step
    await pvProjectCreationPage.selectCreateMode("express");

    // Urban project template selection step
    await pvProjectCreationPage.selectProjectTemplate();

    // Summary step

    await pvProjectCreationPage.expectFinalSummary();
    await pvProjectCreationPage.submitFinalSummary();

    // Creation result
    await pvProjectCreationPage.expectCreationSuccess("Centrale photovoltaïque");

    // View important info (onboarding)
    await pvProjectCreationPage.clickViewImportantInfo();
    await pvProjectCreationPage.expectOnboardingStep1();
  });
});

test.describe("photovoltaic project creation - programmation phase custom mode", () => {
  const PROGRAMMATION_PROJECT_NAME = "Centrale photovoltaïque en programmation de Meylan";

  test("allows authenticated user to create a photovoltaic power station in programmation phase", async ({
    pvProjectCreationPage,
    agriculturalSite,
  }) => {
    // Navigate to project creation with the test site
    await pvProjectCreationPage.goto(agriculturalSite.id);

    // --- Project phase ---
    // "Programmation" phase goes straight to project type (no create-mode selection).
    await pvProjectCreationPage.selectProjectPhase("Programmation");

    // Project type selection
    await pvProjectCreationPage.selectProjectType();

    // Renewable energy type selection
    await pvProjectCreationPage.selectRenewableEnergyType();

    // --- Photovoltaic parameters ---

    // Key parameter: power
    await pvProjectCreationPage.selectKeyParameter("POWER");
    await pvProjectCreationPage.fillPower(296);
    await pvProjectCreationPage.fillSurface(2700);
    await pvProjectCreationPage.fillExpectedAnnualProduction(374);
    await pvProjectCreationPage.fillContractDuration(20);

    // --- Soils transformation ---

    // Soils transformation introduction
    await pvProjectCreationPage.goToNextStep();

    // Soils transformation project selection: keep current soils
    await pvProjectCreationPage.selectSoilsTransformationProject("keepCurrentSoils");

    // Soils summary
    await pvProjectCreationPage.expectSoilsSummaryStep();
    await pvProjectCreationPage.goToNextStep();

    // Soils carbon storage
    await pvProjectCreationPage.expectSoilsCarbonStorageStep();
    await pvProjectCreationPage.goToNextStep();

    // --- Stakeholders ---

    // Stakeholders introduction
    await pvProjectCreationPage.goToNextStep();

    // Developer: select user's own structure
    await pvProjectCreationPage.selectStakeholder(/Ma structure/);

    // Future operator: select user's own structure
    await pvProjectCreationPage.selectStakeholder(/Ma structure/);

    // Site purchase: no
    await pvProjectCreationPage.selectSitePurchase(false);

    // --- Expenses ---

    // Expenses introduction
    await pvProjectCreationPage.goToNextStep();

    // PV installation expenses: accept pre-filled defaults
    await pvProjectCreationPage.submitOrSkipStep();

    // Yearly projected expenses: accept pre-filled defaults
    await pvProjectCreationPage.submitOrSkipStep();

    // --- Revenue ---

    // Revenue introduction
    await pvProjectCreationPage.goToNextStep();

    // Yearly projected revenue: accept pre-filled defaults
    await pvProjectCreationPage.submitOrSkipStep();

    // Financial assistance: skip or accept defaults
    await pvProjectCreationPage.submitOrSkipStep();

    // --- Schedule ---

    await pvProjectCreationPage.fillSchedule("09/2027", "03/2029", 2029);

    // --- Name and description ---

    await pvProjectCreationPage.fillNameAndDescription(PROGRAMMATION_PROJECT_NAME);

    // --- Final summary ---

    await pvProjectCreationPage.expectFinalSummary();
    await pvProjectCreationPage.submitFinalSummary();

    // --- Creation result ---

    await pvProjectCreationPage.expectCreationSuccess(PROGRAMMATION_PROJECT_NAME);
  });
});
