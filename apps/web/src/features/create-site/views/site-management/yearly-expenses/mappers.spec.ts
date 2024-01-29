import { mapFormDataToExpenses } from "./mappers";
import { FormValues } from "./SiteYearlyExpensesForm";

describe("Site yearly expenses mappers", () => {
  it("returns empty array when no expense", () => {
    expect(
      mapFormDataToExpenses(
        {
          rent: {},
          propertyTaxes: {},
          otherTaxes: {},
          maintenance: {},
          otherManagementCosts: {},
          security: {},
          accidentsCost: {},
          illegalDumpingCost: {},
          otherSecuringCosts: {},
        },
        { siteHasTenant: true },
      ),
    ).toEqual([]);
  });

  it("returns array with rent, propertyTaxes and security expenses with default bearers", () => {
    const formCosts: FormValues = {
      rent: {
        amount: 140,
      },
      propertyTaxes: {
        amount: 130,
      },
      otherTaxes: {},
      maintenance: {},
      otherManagementCosts: {},
      security: {
        amount: 89,
      },
      accidentsCost: {},
      illegalDumpingCost: {},
      otherSecuringCosts: {},
    };
    expect(mapFormDataToExpenses(formCosts, { siteHasTenant: true })).toEqual([
      { purpose: "rent", bearer: "tenant", amount: 140, purposeCategory: "rent" },
      { purpose: "propertyTaxes", bearer: "owner", amount: 130, purposeCategory: "taxes" },
      { purpose: "security", bearer: "tenant", amount: 89, purposeCategory: "safety" },
    ]);
  });

  it("returns array with all costs with default bearers", () => {
    const formCosts: FormValues = {
      rent: { amount: 140 },
      propertyTaxes: { amount: 130 },
      otherTaxes: { amount: 3 },
      maintenance: { amount: 19 },
      otherManagementCosts: { amount: 15 },
      security: { amount: 89 },
      accidentsCost: { amount: 12 },
      illegalDumpingCost: { amount: 90 },
      otherSecuringCosts: { amount: 129 },
    };
    expect(mapFormDataToExpenses(formCosts, { siteHasTenant: true })).toEqual([
      { purpose: "rent", bearer: "tenant", amount: 140, purposeCategory: "rent" },
      { purpose: "propertyTaxes", bearer: "owner", amount: 130, purposeCategory: "taxes" },
      { purpose: "otherTaxes", bearer: "tenant", amount: 3, purposeCategory: "taxes" },
      { purpose: "maintenance", bearer: "tenant", amount: 19, purposeCategory: "site_management" },
      {
        purpose: "otherManagementCosts",
        bearer: "tenant",
        amount: 15,
        purposeCategory: "site_management",
      },
      { purpose: "security", bearer: "tenant", amount: 89, purposeCategory: "safety" },
      { purpose: "accidentsCost", bearer: "tenant", amount: 12, purposeCategory: "safety" },
      { purpose: "illegalDumpingCost", bearer: "tenant", amount: 90, purposeCategory: "safety" },
      { purpose: "otherSecuringCosts", bearer: "tenant", amount: 129, purposeCategory: "safety" },
    ]);
  });

  it("returns array with all costs with owner as bearer when no tenant", () => {
    const formCosts: FormValues = {
      rent: {},
      propertyTaxes: { amount: 130 },
      otherTaxes: { amount: 3 },
      maintenance: { amount: 19 },
      otherManagementCosts: { amount: 15 },
      security: { amount: 89 },
      accidentsCost: { amount: 12 },
      illegalDumpingCost: { amount: 90 },
      otherSecuringCosts: { amount: 129 },
    };
    expect(mapFormDataToExpenses(formCosts, { siteHasTenant: false })).toEqual([
      { purpose: "propertyTaxes", bearer: "owner", amount: 130, purposeCategory: "taxes" },
      { purpose: "otherTaxes", bearer: "owner", amount: 3, purposeCategory: "taxes" },
      { purpose: "maintenance", bearer: "owner", amount: 19, purposeCategory: "site_management" },
      {
        purpose: "otherManagementCosts",
        bearer: "owner",
        amount: 15,
        purposeCategory: "site_management",
      },
      { purpose: "security", bearer: "owner", amount: 89, purposeCategory: "safety" },
      { purpose: "accidentsCost", bearer: "owner", amount: 12, purposeCategory: "safety" },
      { purpose: "illegalDumpingCost", bearer: "owner", amount: 90, purposeCategory: "safety" },
      { purpose: "otherSecuringCosts", bearer: "owner", amount: 129, purposeCategory: "safety" },
    ]);
  });

  it("returns array with all costs with given bearers", () => {
    const formCosts: FormValues = {
      rent: { amount: 140 },
      propertyTaxes: { amount: 130 },
      otherTaxes: { amount: 3 },
      maintenance: { amount: 19, bearer: "owner" },
      otherManagementCosts: { amount: 15 },
      security: { amount: 89, bearer: "owner" },
      accidentsCost: { amount: 12 },
      illegalDumpingCost: { amount: 90, bearer: "owner" },
      otherSecuringCosts: { amount: 129, bearer: "owner" },
    };
    expect(mapFormDataToExpenses(formCosts, { siteHasTenant: true })).toEqual([
      { purpose: "rent", bearer: "tenant", amount: 140, purposeCategory: "rent" },
      { purpose: "propertyTaxes", bearer: "owner", amount: 130, purposeCategory: "taxes" },
      { purpose: "otherTaxes", bearer: "tenant", amount: 3, purposeCategory: "taxes" },
      { purpose: "maintenance", bearer: "owner", amount: 19, purposeCategory: "site_management" },
      {
        purpose: "otherManagementCosts",
        bearer: "tenant",
        amount: 15,
        purposeCategory: "site_management",
      },
      { purpose: "security", bearer: "owner", amount: 89, purposeCategory: "safety" },
      { purpose: "accidentsCost", bearer: "tenant", amount: 12, purposeCategory: "safety" },
      { purpose: "illegalDumpingCost", bearer: "owner", amount: 90, purposeCategory: "safety" },
      { purpose: "otherSecuringCosts", bearer: "owner", amount: 129, purposeCategory: "safety" },
    ]);
  });
});
