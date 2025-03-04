import { revertStep } from "../createSite.reducer";

export const isFricheReverted = () => revertStep({ resetFields: ["isFriche"] });
export const siteNatureReverted = () => revertStep({ resetFields: ["nature"] });
export const revertAddressStep = () => revertStep({ resetFields: ["address"] });
export const revertSurfaceAreaStep = () => revertStep({ resetFields: ["surfaceArea"] });
export const revertSoilsSelectionStep = () => revertStep({ resetFields: ["soils"] });
export const revertSoilsSurfaceAreaDistributionEntryModeStep = () =>
  revertStep({
    resetFields: ["soilsDistributionEntryMode", "soilsDistribution"],
  });
export const revertSoilsDistributionStep = () => revertStep({ resetFields: ["soilsDistribution"] });
export const revertSoilContaminationIntroductionStep = () => revertStep();
export const revertSoilsContaminationStep = () =>
  revertStep({
    resetFields: ["hasContaminatedSoils", "contaminatedSoilSurface"],
  });
export const revertOwnerStep = () => revertStep({ resetFields: ["owner"] });
export const revertIsFricheLeasedStep = () => revertStep({ resetFields: ["isFricheLeased"] });
export const revertIsSiteOperatedStep = () => revertStep({ resetFields: ["isSiteOperated"] });
export const revertTenantStep = () => revertStep({ resetFields: ["tenant"] });
export const revertOperatorStep = () => revertStep({ resetFields: ["tenant"] });
export const revertFricheAccidentsIntroductionStep = () => revertStep();
export const revertFricheAccidentsStep = () =>
  revertStep({
    resetFields: [
      "hasRecentAccidents",
      "accidentsMinorInjuries",
      "accidentsSevereInjuries",
      "accidentsDeaths",
    ],
  });
export const revertYearlyExpensesStep = () => revertStep({ resetFields: ["yearlyExpenses"] });
export const revertYearlyIncomeStep = () => revertStep({ resetFields: ["yearlyIncomes"] });
export const revertFricheActivityStep = () => revertStep({ resetFields: ["fricheActivity"] });
export const namingIntroductionStepReverted = () => revertStep();
export const revertNamingStep = () => revertStep({ resetFields: ["name", "description"] });
