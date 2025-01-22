import {
  getSiteManagementExpensesBaseConfig,
  getSiteSecurityExpensesBaseConfig,
} from "../expenses.functions";

describe("Expenses functions", () => {
  describe("getSiteManagementExpensesBaseConfig", () => {
    it("returns default site management expenses for friche with tenant", () => {
      const input = { hasTenant: true, isOperated: false };
      expect(getSiteManagementExpensesBaseConfig(input)).toEqual([
        { purpose: "rent", fixedBearer: "tenant" },
        { purpose: "maintenance", fixedBearer: "tenant" },
        { purpose: "propertyTaxes", fixedBearer: "owner" },
        { purpose: "otherManagementCosts", fixedBearer: null },
      ]);
    });

    it("returns default site management expenses for friche with no tenant", () => {
      const input = { hasTenant: false, isOperated: false };
      expect(getSiteManagementExpensesBaseConfig(input)).toEqual([
        { purpose: "maintenance", fixedBearer: "owner" },
        { purpose: "propertyTaxes", fixedBearer: "owner" },
        { purpose: "otherManagementCosts", fixedBearer: "owner" },
      ]);
    });

    it("returns default site management expenses for site operated by owner", () => {
      const input = { hasTenant: false, isOperated: true };
      expect(getSiteManagementExpensesBaseConfig(input)).toEqual([
        { purpose: "operationsTaxes", fixedBearer: "owner" },
        { purpose: "maintenance", fixedBearer: "owner" },
        { purpose: "propertyTaxes", fixedBearer: "owner" },
        { purpose: "otherManagementCosts", fixedBearer: "owner" },
      ]);
    });

    it("returns default site management expenses for site operated by tenant", () => {
      const input = { hasTenant: true, isOperated: true };
      expect(getSiteManagementExpensesBaseConfig(input)).toEqual([
        { purpose: "rent", fixedBearer: "tenant" },
        { purpose: "operationsTaxes", fixedBearer: "tenant" },
        { purpose: "maintenance", fixedBearer: "tenant" },
        { purpose: "propertyTaxes", fixedBearer: "owner" },
        { purpose: "otherManagementCosts", fixedBearer: null },
      ]);
    });

    it("returns default site management expenses for site not operated", () => {
      const input = { hasTenant: false, isOperated: false };
      expect(getSiteManagementExpensesBaseConfig(input)).toEqual([
        { purpose: "maintenance", fixedBearer: "owner" },
        { purpose: "propertyTaxes", fixedBearer: "owner" },
        { purpose: "otherManagementCosts", fixedBearer: "owner" },
      ]);
    });
  });

  describe("getSiteSecurityExpensesBaseConfig", () => {
    it("returns expenses for friche with tenant and recent accident", () => {
      const input = {
        hasTenant: true,
        hasRecentAccidents: true,
      };
      expect(getSiteSecurityExpensesBaseConfig(input)).toEqual([
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
      expect(getSiteSecurityExpensesBaseConfig(input)).toEqual([
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
      expect(getSiteSecurityExpensesBaseConfig(input)).toEqual([
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
      expect(getSiteSecurityExpensesBaseConfig(input)).toEqual([
        { purpose: "security", fixedBearer: "owner" },
        { purpose: "illegalDumpingCost", fixedBearer: "owner" },
        { purpose: "otherSecuringCosts", fixedBearer: "owner" },
      ]);
    });
  });
});
