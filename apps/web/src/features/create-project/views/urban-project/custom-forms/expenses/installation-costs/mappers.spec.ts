import { ComputedInstallationCosts, UrbanProjectDevelopmentExpense } from "shared";

import { mapFormValuesToReinstatementExpenses } from "@/features/create-project/views/common-views/expenses/reinstatement/mappers";

import { mapFormValuesToExpenses, mapInitialValues } from "./mappers";

describe("Urban project installation costs form mappers", () => {
  describe("mapFormValuesToExpenses", () => {
    it("should return an empty when form values are empty", () => {
      const result = mapFormValuesToReinstatementExpenses({});
      expect(result).toEqual([]);
    });
    it("should filter out undefined and zero values", () => {
      const result = mapFormValuesToExpenses({
        technicalStudyAmount: 0,
        worksAmount: undefined,
        otherAmount: 50,
      });
      expect(result).toEqual([{ purpose: "other", amount: 50 }]);
    });
  });
  describe("mapInitialValues", () => {
    it("should return mapped given pre-entered data over default values", () => {
      const preEnteredData: UrbanProjectDevelopmentExpense[] = [
        { purpose: "technical_studies", amount: 100 },
        { purpose: "development_works", amount: 200 },
      ];
      const defaultValues: ComputedInstallationCosts = {
        technicalStudies: 430,
        developmentWorks: 540,
        other: 50,
      };
      const result = mapInitialValues(preEnteredData, defaultValues);
      expect(result).toEqual({
        technicalStudyAmount: 100,
        worksAmount: 200,
      });
    });

    it("should return mapped given default values when no pre-entered data", () => {
      const defaultValues: ComputedInstallationCosts = {
        technicalStudies: 430,
        developmentWorks: 540,
        other: 50,
      };
      const result = mapInitialValues(undefined, defaultValues);
      expect(result).toEqual({
        technicalStudyAmount: 430,
        worksAmount: 540,
        otherAmount: 50,
      });
    });
    it("should return undefined when no pre-entered data nor default values", () => {
      const result = mapInitialValues(undefined, undefined);
      expect(result).toEqual(undefined);
    });
  });
});
