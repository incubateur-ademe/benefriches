import { relatedSiteData } from "../../../../__tests__/siteData.mock";
import { SoilsDecontaminationSelectionHandler } from "./soilsDecontaminationSelection.handler";

// Pure-function tests for the decontamination branch. E2E only ever drives the "none"
// option, so these guard the "partial" and "unknown" paths at the handler level.
describe("SoilsDecontaminationSelectionHandler", () => {
  describe("getNextStepId", () => {
    it("goes to the surface-area step when decontamination is partial", () => {
      const nextStep = SoilsDecontaminationSelectionHandler.getNextStepId(
        { context: { siteData: undefined }, answers: {} },
        { decontaminationPlan: "partial" },
      );

      expect(nextStep).toBe("RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SURFACE_AREA");
    });

    it("skips to the soils transformation introduction when decontamination is none", () => {
      const nextStep = SoilsDecontaminationSelectionHandler.getNextStepId(
        { context: { siteData: undefined }, answers: {} },
        { decontaminationPlan: "none", decontaminatedSurfaceArea: 0 },
      );

      expect(nextStep).toBe("RENEWABLE_ENERGY_SOILS_TRANSFORMATION_INTRODUCTION");
    });

    it("skips to the soils transformation introduction when decontamination is unknown", () => {
      const nextStep = SoilsDecontaminationSelectionHandler.getNextStepId(
        { context: { siteData: undefined }, answers: {} },
        { decontaminationPlan: "unknown" },
      );

      expect(nextStep).toBe("RENEWABLE_ENERGY_SOILS_TRANSFORMATION_INTRODUCTION");
    });
  });

  describe("updateAnswersMiddleware", () => {
    it("forces the decontaminated surface to zero when decontamination is none", () => {
      const answers = SoilsDecontaminationSelectionHandler.updateAnswersMiddleware!(
        { context: { siteData: undefined }, answers: {} },
        { decontaminationPlan: "none", decontaminatedSurfaceArea: 999 },
      );

      expect(answers).toEqual({ decontaminationPlan: "none", decontaminatedSurfaceArea: 0 });
    });

    it("derives a default decontaminated surface (25% of contaminated soil) when decontamination is unknown", () => {
      const answers = SoilsDecontaminationSelectionHandler.updateAnswersMiddleware!(
        {
          context: { siteData: { ...relatedSiteData, contaminatedSoilSurface: 2000 } },
          answers: {},
        },
        { decontaminationPlan: "unknown" },
      );

      expect(answers).toEqual({ decontaminationPlan: "unknown", decontaminatedSurfaceArea: 500 });
    });

    it("leaves the answers untouched when decontamination is partial", () => {
      const answers = SoilsDecontaminationSelectionHandler.updateAnswersMiddleware!(
        { context: { siteData: undefined }, answers: {} },
        { decontaminationPlan: "partial", decontaminatedSurfaceArea: 1200 },
      );

      expect(answers).toEqual({ decontaminationPlan: "partial", decontaminatedSurfaceArea: 1200 });
    });
  });
});
