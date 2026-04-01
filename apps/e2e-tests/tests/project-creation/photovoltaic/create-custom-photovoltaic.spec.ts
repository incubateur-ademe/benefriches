import { test } from "./fixtures";

const PROJECT_NAME = "Centrale photovoltaïque de Meylan";

test.describe("photovoltaic project creation - custom mode", () => {
  test("allows authenticated user to create a photovoltaic power station via custom mode", async ({
    pvProjectCreationPage,
    testSite,
  }) => {
    // Navigate to project creation
    await pvProjectCreationPage.goto(testSite.id);

    // Introduction step
    await pvProjectCreationPage.expectIntroductionStep(testSite.name);
    await pvProjectCreationPage.clickStart();

    // Project type selection
    await pvProjectCreationPage.selectProjectType();

    // Renewable energy type selection
    await pvProjectCreationPage.selectRenewableEnergyType();

    // Create mode selection
    await pvProjectCreationPage.selectCreateMode("custom");

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

    // --- Project phase ---

    await pvProjectCreationPage.selectProjectPhase("Développement");

    // --- Name and description ---

    await pvProjectCreationPage.fillNameAndDescription(PROJECT_NAME);

    // --- Final summary ---

    await pvProjectCreationPage.expectFinalSummary();
    await pvProjectCreationPage.submitFinalSummary();

    // --- Creation result ---

    await pvProjectCreationPage.expectCreationSuccess(PROJECT_NAME);
  });
});
