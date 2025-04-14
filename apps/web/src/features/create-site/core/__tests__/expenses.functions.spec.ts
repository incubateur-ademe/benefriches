import {
  getAgriculturalOperationExpensesBaseConfig,
  getFricheManagementExpensesBaseConfig,
  getFricheSecurityExpensesBaseConfig,
} from "../expenses.functions";

describe("Expenses functions", () => {
  describe("getFricheManagementExpensesBaseConfig", () => {
    it("returns management expenses config for friche with tenant", () => {
      const input = { hasTenant: true };
      expect(getFricheManagementExpensesBaseConfig(input)).toEqual([
        { purpose: "rent", fixedBearer: "tenant" },
        { purpose: "maintenance", fixedBearer: "tenant" },
        { purpose: "propertyTaxes", fixedBearer: "owner" },
        { purpose: "otherManagementCosts", fixedBearer: null },
      ]);
    });

    it("returns management expenses config for friche with no tenant", () => {
      const input = { hasTenant: false };
      expect(getFricheManagementExpensesBaseConfig(input)).toEqual([
        { purpose: "maintenance", fixedBearer: "owner" },
        { purpose: "propertyTaxes", fixedBearer: "owner" },
        { purpose: "otherManagementCosts", fixedBearer: "owner" },
      ]);
    });
  });

  describe("getAgriculturalOperationExpensesBaseConfig", () => {
    it("returns expenses config when not operated", () => {
      const input = { isOperated: false, isOperatedByOwner: false };
      expect(getAgriculturalOperationExpensesBaseConfig(input)).toEqual([
        { purpose: "propertyTaxes", fixedBearer: "owner" },
      ]);
    });

    it("returns expenses config when operated by owner", () => {
      const input = { isOperated: true, isOperatedByOwner: true };
      expect(getAgriculturalOperationExpensesBaseConfig(input)).toEqual([
        { purpose: "propertyTaxes", fixedBearer: "owner" },
        { purpose: "operationsTaxes", fixedBearer: "owner" },
        { purpose: "otherOperationsCosts", fixedBearer: "owner" },
      ]);
    });

    it("returns expenses config when operated by tenant", () => {
      const input = { isOperated: true, isOperatedByOwner: false };
      expect(getAgriculturalOperationExpensesBaseConfig(input)).toEqual([
        { purpose: "rent", fixedBearer: "tenant" },
        { purpose: "operationsTaxes", fixedBearer: "tenant" },
        { purpose: "otherOperationsCosts", fixedBearer: "tenant" },
        { purpose: "propertyTaxes", fixedBearer: "owner" },
      ]);
    });
  });

  describe("getFricheSecurityExpensesBaseConfig", () => {
    it("returns expenses for friche with tenant and recent accident", () => {
      const input = {
        hasTenant: true,
        hasRecentAccidents: true,
      };
      expect(getFricheSecurityExpensesBaseConfig(input)).toEqual([
        { purpose: "security", fixedBearer: null },
        { purpose: "illegalDumpingCost", fixedBearer: null },
        { purpose: "otherSecuringCosts", fixedBearer: null },
        { purpose: "accidentsCost", fixedBearer: null },
      ]);
    });

    it("returns expenses for friche with no tenant and recent accident", () => {
      const input = {
        hasTenant: false,
        hasRecentAccidents: true,
      };
      expect(getFricheSecurityExpensesBaseConfig(input)).toEqual([
        { purpose: "security", fixedBearer: "owner" },
        { purpose: "illegalDumpingCost", fixedBearer: "owner" },
        { purpose: "otherSecuringCosts", fixedBearer: "owner" },
        { purpose: "accidentsCost", fixedBearer: "owner" },
      ]);
    });

    it("returns expenses for friche with tenant and no recent accident", () => {
      const input = {
        hasTenant: true,
        hasRecentAccidents: false,
      };
      expect(getFricheSecurityExpensesBaseConfig(input)).toEqual([
        { purpose: "security", fixedBearer: null },
        { purpose: "illegalDumpingCost", fixedBearer: null },
        { purpose: "otherSecuringCosts", fixedBearer: null },
      ]);
    });

    it("returns expenses for friche with no tenant and no recent accident", () => {
      const input = {
        hasTenant: false,
        hasRecentAccidents: false,
      };
      expect(getFricheSecurityExpensesBaseConfig(input)).toEqual([
        { purpose: "security", fixedBearer: "owner" },
        { purpose: "illegalDumpingCost", fixedBearer: "owner" },
        { purpose: "otherSecuringCosts", fixedBearer: "owner" },
      ]);
    });
  });
});
