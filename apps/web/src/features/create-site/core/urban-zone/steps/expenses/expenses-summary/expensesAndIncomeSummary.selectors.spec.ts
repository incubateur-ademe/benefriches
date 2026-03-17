import { StoreBuilder } from "@/features/create-site/core/urban-zone/__tests__/_testStoreHelpers";

import { selectExpensesAndIncomeSummaryViewData } from "./expensesAndIncomeSummary.selectors";

describe("selectExpensesAndIncomeSummaryViewData", () => {
  it("should return empty arrays when no step answers are filled", () => {
    const store = new StoreBuilder().build();

    const result = selectExpensesAndIncomeSummaryViewData(store.getState());

    expect(result).toEqual({ expenses: [], incomes: [] });
  });

  describe("vacantPremisesExpenses", () => {
    it("should map owner fields to owner expenses with correct purposes", () => {
      const store = new StoreBuilder()
        .withUrbanZoneSteps({
          URBAN_ZONE_VACANT_PREMISES_EXPENSES: {
            completed: true,
            payload: {
              ownerPropertyTaxes: 1000,
              ownerMaintenance: 500,
              ownerSecurity: 200,
              ownerIllegalDumpingCost: 300,
              ownerOtherManagementCosts: 150,
            },
          },
        })
        .build();

      const result = selectExpensesAndIncomeSummaryViewData(store.getState());

      expect(result.expenses).toEqual([
        { purpose: "propertyTaxes", amount: 1000, bearer: "owner" },
        { purpose: "maintenance", amount: 500, bearer: "owner" },
        { purpose: "security", amount: 200, bearer: "owner" },
        { purpose: "illegalDumpingCost", amount: 300, bearer: "owner" },
        { purpose: "otherManagementCosts", amount: 150, bearer: "owner" },
      ]);
    });

    it("should map tenant fields to tenant expenses with correct purposes", () => {
      const store = new StoreBuilder()
        .withUrbanZoneSteps({
          URBAN_ZONE_VACANT_PREMISES_EXPENSES: {
            completed: true,
            payload: {
              tenantRent: 2400,
              tenantOperationsTaxes: 600,
              tenantOtherOperationsCosts: 100,
            },
          },
        })
        .build();

      const result = selectExpensesAndIncomeSummaryViewData(store.getState());

      expect(result.expenses).toEqual([
        { purpose: "rent", amount: 2400, bearer: "tenant" },
        { purpose: "operationsTaxes", amount: 600, bearer: "tenant" },
        { purpose: "otherOperationsCosts", amount: 100, bearer: "tenant" },
      ]);
    });

    it("should filter out zero values from vacantPremisesExpenses", () => {
      const store = new StoreBuilder()
        .withUrbanZoneSteps({
          URBAN_ZONE_VACANT_PREMISES_EXPENSES: {
            completed: true,
            payload: {
              ownerPropertyTaxes: 0,
              ownerMaintenance: 500,
              tenantRent: 0,
              tenantOperationsTaxes: 200,
            },
          },
        })
        .build();

      const result = selectExpensesAndIncomeSummaryViewData(store.getState());

      expect(result.expenses).toEqual([
        { purpose: "maintenance", amount: 500, bearer: "owner" },
        { purpose: "operationsTaxes", amount: 200, bearer: "tenant" },
      ]);
    });

    it("should filter out undefined values from vacantPremisesExpenses", () => {
      const store = new StoreBuilder()
        .withUrbanZoneSteps({
          URBAN_ZONE_VACANT_PREMISES_EXPENSES: {
            completed: true,
            payload: {
              ownerPropertyTaxes: undefined,
              ownerMaintenance: 500,
            },
          },
        })
        .build();

      const result = selectExpensesAndIncomeSummaryViewData(store.getState());

      expect(result.expenses).toEqual([{ purpose: "maintenance", amount: 500, bearer: "owner" }]);
    });
  });

  describe("zoneManagementExpenses", () => {
    it("should map zoneManagementExpenses fields to owner expenses with correct purposes", () => {
      const store = new StoreBuilder()
        .withUrbanZoneSteps({
          URBAN_ZONE_ZONE_MANAGEMENT_EXPENSES: {
            completed: true,
            payload: {
              maintenance: 800,
              security: 400,
              illegalDumpingCost: 250,
              otherManagementCosts: 120,
            },
          },
        })
        .build();

      const result = selectExpensesAndIncomeSummaryViewData(store.getState());

      expect(result.expenses).toEqual([
        { purpose: "maintenance", amount: 800, bearer: "owner" },
        { purpose: "security", amount: 400, bearer: "owner" },
        { purpose: "illegalDumpingCost", amount: 250, bearer: "owner" },
        { purpose: "otherManagementCosts", amount: 120, bearer: "owner" },
      ]);
    });

    it("should filter out zero and undefined values from zoneManagementExpenses", () => {
      const store = new StoreBuilder()
        .withUrbanZoneSteps({
          URBAN_ZONE_ZONE_MANAGEMENT_EXPENSES: {
            completed: true,
            payload: {
              maintenance: 0,
              security: undefined,
              illegalDumpingCost: 250,
            },
          },
        })
        .build();

      const result = selectExpensesAndIncomeSummaryViewData(store.getState());

      expect(result.expenses).toEqual([
        { purpose: "illegalDumpingCost", amount: 250, bearer: "owner" },
      ]);
    });
  });

  describe("localAuthorityExpenses", () => {
    it("should map localAuthorityExpenses fields to owner expenses with correct purposes", () => {
      const store = new StoreBuilder()
        .withUrbanZoneSteps({
          URBAN_ZONE_LOCAL_AUTHORITY_EXPENSES: {
            completed: true,
            payload: {
              maintenance: 700,
              otherManagementCosts: 90,
            },
          },
        })
        .build();

      const result = selectExpensesAndIncomeSummaryViewData(store.getState());

      expect(result.expenses).toEqual([
        { purpose: "maintenance", amount: 700, bearer: "owner" },
        { purpose: "otherManagementCosts", amount: 90, bearer: "owner" },
      ]);
    });

    it("should filter out zero and undefined values from localAuthorityExpenses", () => {
      const store = new StoreBuilder()
        .withUrbanZoneSteps({
          URBAN_ZONE_LOCAL_AUTHORITY_EXPENSES: {
            completed: true,
            payload: {
              maintenance: 0,
              otherManagementCosts: undefined,
            },
          },
        })
        .build();

      const result = selectExpensesAndIncomeSummaryViewData(store.getState());

      expect(result.expenses).toEqual([]);
    });
  });

  describe("zoneManagementIncome", () => {
    it("should map zoneManagementIncome fields to incomes with correct sources", () => {
      const store = new StoreBuilder()
        .withUrbanZoneSteps({
          URBAN_ZONE_ZONE_MANAGEMENT_INCOME: {
            completed: true,
            payload: {
              rent: 3600,
              subsidies: 1200,
              otherIncome: 300,
            },
          },
        })
        .build();

      const result = selectExpensesAndIncomeSummaryViewData(store.getState());

      expect(result.incomes).toEqual([
        { source: "rent", amount: 3600 },
        { source: "subsidies", amount: 1200 },
        { source: "other", amount: 300 },
      ]);
    });

    it("should filter out zero and undefined values from zoneManagementIncome", () => {
      const store = new StoreBuilder()
        .withUrbanZoneSteps({
          URBAN_ZONE_ZONE_MANAGEMENT_INCOME: {
            completed: true,
            payload: {
              rent: 0,
              subsidies: undefined,
              otherIncome: 300,
            },
          },
        })
        .build();

      const result = selectExpensesAndIncomeSummaryViewData(store.getState());

      expect(result.incomes).toEqual([{ source: "other", amount: 300 }]);
    });
  });

  it("should aggregate expenses from all three expense steps", () => {
    const store = new StoreBuilder()
      .withUrbanZoneSteps({
        URBAN_ZONE_VACANT_PREMISES_EXPENSES: {
          completed: true,
          payload: {
            ownerPropertyTaxes: 1000,
            tenantRent: 2400,
          },
        },
        URBAN_ZONE_ZONE_MANAGEMENT_EXPENSES: {
          completed: true,
          payload: {
            maintenance: 800,
          },
        },
        URBAN_ZONE_LOCAL_AUTHORITY_EXPENSES: {
          completed: true,
          payload: {
            otherManagementCosts: 90,
          },
        },
      })
      .build();

    const result = selectExpensesAndIncomeSummaryViewData(store.getState());

    expect(result.expenses).toEqual([
      { purpose: "propertyTaxes", amount: 1000, bearer: "owner" },
      { purpose: "rent", amount: 2400, bearer: "tenant" },
      { purpose: "maintenance", amount: 800, bearer: "owner" },
      { purpose: "otherManagementCosts", amount: 90, bearer: "owner" },
    ]);
  });
});
