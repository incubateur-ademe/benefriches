import {
  getSiteManagementExpensesWithBearer,
  getSiteSecurityExpensesWithBearer,
  mapFormDataToExpenses,
} from "./mappers";
import { FormValues } from "./SiteYearlyExpensesForm";

describe("getSiteManagementExpensesWithBearer", () => {
  it("returns expenses for friche with tenant", () => {
    expect(getSiteManagementExpensesWithBearer(true, false, true)).toEqual([
      { name: "rent", bearer: "tenant" },
      { name: "operationsTaxes", bearer: "tenant" },
      { name: "maintenance", bearer: "tenant" },
      { name: "propertyTaxes", bearer: "owner" },
      { name: "otherManagementCosts", bearer: undefined },
    ]);
  });

  it("returns expenses for friche with no tenant", () => {
    expect(getSiteManagementExpensesWithBearer(true, false, false)).toEqual([
      { name: "maintenance", bearer: "owner" },
      { name: "propertyTaxes", bearer: "owner" },
      { name: "otherManagementCosts", bearer: "owner" },
    ]);
  });

  it("returns expenses for site non friche with tenant", () => {
    expect(getSiteManagementExpensesWithBearer(false, true, true)).toEqual([
      { name: "rent", bearer: "tenant" },
      { name: "operationsTaxes", bearer: "tenant" },
      { name: "maintenance", bearer: "tenant" },
      { name: "propertyTaxes", bearer: "owner" },
      { name: "otherManagementCosts", bearer: undefined },
    ]);
  });

  it("returns expenses for site non friche not worked", () => {
    expect(getSiteManagementExpensesWithBearer(false, false, false)).toEqual([
      { name: "maintenance", bearer: "owner" },
      { name: "propertyTaxes", bearer: "owner" },
      { name: "otherManagementCosts", bearer: "owner" },
    ]);
  });

  it("returns expenses for site non friche worked by owner", () => {
    expect(getSiteManagementExpensesWithBearer(false, true, false)).toEqual([
      { name: "operationsTaxes", bearer: "owner" },
      { name: "maintenance", bearer: "owner" },
      { name: "propertyTaxes", bearer: "owner" },
      { name: "otherManagementCosts", bearer: "owner" },
    ]);
  });
});

describe("getSiteSecurityExpensesWithBearer", () => {
  it("returns expenses for friche with tenant and recent accident", () => {
    expect(getSiteSecurityExpensesWithBearer(true, true)).toEqual([
      { name: "security", bearer: undefined },
      { name: "illegalDumpingCost", bearer: undefined },
      { name: "otherSecuringCosts", bearer: undefined },
      { name: "accidentsCost", bearer: undefined },
    ]);
  });

  it("returns expenses for friche with no tenant and recent accident", () => {
    expect(getSiteSecurityExpensesWithBearer(false, true)).toEqual([
      { name: "security", bearer: "owner" },
      { name: "illegalDumpingCost", bearer: "owner" },
      { name: "otherSecuringCosts", bearer: "owner" },
      { name: "accidentsCost", bearer: "owner" },
    ]);
  });

  it("returns expenses for friche with tenant and no recent accident", () => {
    expect(getSiteSecurityExpensesWithBearer(true, false)).toEqual([
      { name: "security", bearer: undefined },
      { name: "illegalDumpingCost", bearer: undefined },
      { name: "otherSecuringCosts", bearer: undefined },
    ]);
  });

  it("returns expenses for friche with no tenant and no recent accident", () => {
    expect(getSiteSecurityExpensesWithBearer(false, false)).toEqual([
      { name: "security", bearer: "owner" },
      { name: "illegalDumpingCost", bearer: "owner" },
      { name: "otherSecuringCosts", bearer: "owner" },
    ]);
  });
});

describe("Site yearly expenses mappers", () => {
  it("returns empty array when no expense", () => {
    expect(
      mapFormDataToExpenses(
        {
          rent: {},
          propertyTaxes: {},
          operationsTaxes: {},
          maintenance: {},
          otherManagementCosts: {},
          security: {},
          accidentsCost: {},
          illegalDumpingCost: {},
          otherSecuringCosts: {},
        },
        [
          { name: "rent", bearer: "tenant" },
          { name: "operationsTaxes", bearer: "tenant" },
          { name: "maintenance", bearer: "tenant" },
          { name: "propertyTaxes", bearer: "owner" },
          { name: "otherManagementCosts", bearer: "tenant" },
          { name: "security", bearer: "owner" },
          { name: "illegalDumpingCost", bearer: "owner" },
          { name: "accidentsCost", bearer: "owner" },
        ],
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
      operationsTaxes: {},
      maintenance: {},
      otherManagementCosts: {},
      security: {
        amount: 89,
      },
      accidentsCost: {},
      illegalDumpingCost: {},
      otherSecuringCosts: {},
    };
    expect(
      mapFormDataToExpenses(formCosts, [
        { name: "rent", bearer: "tenant" },
        { name: "operationsTaxes", bearer: "tenant" },
        { name: "maintenance", bearer: "tenant" },
        { name: "propertyTaxes", bearer: "owner" },
        { name: "otherManagementCosts", bearer: "tenant" },
        { name: "security", bearer: "owner" },
        { name: "illegalDumpingCost", bearer: "owner" },
        { name: "otherSecuringCosts", bearer: "tenant" },
        { name: "accidentsCost", bearer: "owner" },
      ]),
    ).toEqual([
      { purpose: "rent", bearer: "tenant", amount: 140, purposeCategory: "rent" },
      { purpose: "propertyTaxes", bearer: "owner", amount: 130, purposeCategory: "taxes" },
      { purpose: "security", bearer: "owner", amount: 89, purposeCategory: "safety" },
    ]);
  });

  it("returns array with all costs with default bearers", () => {
    const formCosts: FormValues = {
      rent: { amount: 140 },
      propertyTaxes: { amount: 130 },
      operationsTaxes: { amount: 3 },
      maintenance: { amount: 19 },
      otherManagementCosts: { amount: 15 },
      security: { amount: 89 },
      accidentsCost: { amount: 12 },
      illegalDumpingCost: { amount: 90 },
      otherSecuringCosts: { amount: 129 },
    };
    expect(
      mapFormDataToExpenses(formCosts, [
        { name: "rent", bearer: "tenant" },
        { name: "operationsTaxes", bearer: "tenant" },
        { name: "maintenance", bearer: "tenant" },
        { name: "propertyTaxes", bearer: "owner" },
        { name: "otherManagementCosts", bearer: "tenant" },
        { name: "security", bearer: "owner" },
        { name: "illegalDumpingCost", bearer: "owner" },
        { name: "otherSecuringCosts", bearer: "tenant" },
        { name: "accidentsCost", bearer: "owner" },
      ]),
    ).toEqual([
      { purpose: "rent", bearer: "tenant", amount: 140, purposeCategory: "rent" },
      { purpose: "operationsTaxes", bearer: "tenant", amount: 3, purposeCategory: "taxes" },
      { purpose: "maintenance", bearer: "tenant", amount: 19, purposeCategory: "site_management" },
      { purpose: "propertyTaxes", bearer: "owner", amount: 130, purposeCategory: "taxes" },
      {
        purpose: "otherManagementCosts",
        bearer: "tenant",
        amount: 15,
        purposeCategory: "site_management",
      },
      { purpose: "security", bearer: "owner", amount: 89, purposeCategory: "safety" },
      { purpose: "illegalDumpingCost", bearer: "owner", amount: 90, purposeCategory: "safety" },
      { purpose: "otherSecuringCosts", bearer: "tenant", amount: 129, purposeCategory: "safety" },
      { purpose: "accidentsCost", bearer: "owner", amount: 12, purposeCategory: "safety" },
    ]);
  });

  it("returns array with all costs with owner as bearer when no tenant", () => {
    const formCosts: FormValues = {
      rent: {},
      propertyTaxes: { amount: 130 },
      operationsTaxes: {},
      maintenance: { amount: 19 },
      otherManagementCosts: { amount: 15 },
      security: { amount: 89 },
      accidentsCost: { amount: 12 },
      illegalDumpingCost: { amount: 90 },
      otherSecuringCosts: { amount: 129 },
    };
    expect(
      mapFormDataToExpenses(formCosts, [
        { name: "rent", bearer: "owner" },
        { name: "operationsTaxes", bearer: "owner" },
        { name: "maintenance", bearer: "owner" },
        { name: "propertyTaxes", bearer: "owner" },
        { name: "otherManagementCosts", bearer: "owner" },
        { name: "security", bearer: "owner" },
        { name: "illegalDumpingCost", bearer: "owner" },
        { name: "otherSecuringCosts", bearer: "owner" },
        { name: "accidentsCost", bearer: "owner" },
      ]),
    ).toEqual([
      { purpose: "maintenance", bearer: "owner", amount: 19, purposeCategory: "site_management" },
      { purpose: "propertyTaxes", bearer: "owner", amount: 130, purposeCategory: "taxes" },
      {
        purpose: "otherManagementCosts",
        bearer: "owner",
        amount: 15,
        purposeCategory: "site_management",
      },
      { purpose: "security", bearer: "owner", amount: 89, purposeCategory: "safety" },
      { purpose: "illegalDumpingCost", bearer: "owner", amount: 90, purposeCategory: "safety" },
      { purpose: "otherSecuringCosts", bearer: "owner", amount: 129, purposeCategory: "safety" },
      { purpose: "accidentsCost", bearer: "owner", amount: 12, purposeCategory: "safety" },
    ]);
  });

  it("returns array with all costs with given bearers", () => {
    const formCosts: FormValues = {
      rent: { amount: 140 },
      propertyTaxes: { amount: 130 },
      operationsTaxes: { amount: 3 },
      maintenance: { amount: 19 },
      otherManagementCosts: { amount: 15, bearer: "tenant" },
      security: { amount: 89, bearer: "owner" },
      accidentsCost: { amount: 12, bearer: "tenant" },
      illegalDumpingCost: { amount: 90, bearer: "owner" },
      otherSecuringCosts: { amount: 129, bearer: "owner" },
    };
    expect(
      mapFormDataToExpenses(formCosts, [
        { name: "rent", bearer: "tenant" },
        { name: "operationsTaxes", bearer: "tenant" },
        { name: "maintenance", bearer: "owner" },
        { name: "propertyTaxes", bearer: "owner" },
        { name: "otherManagementCosts", bearer: undefined },
        { name: "security", bearer: undefined },
        { name: "illegalDumpingCost", bearer: undefined },
        { name: "otherSecuringCosts", bearer: undefined },
        { name: "accidentsCost", bearer: undefined },
      ]),
    ).toEqual([
      { purpose: "rent", bearer: "tenant", amount: 140, purposeCategory: "rent" },
      { purpose: "operationsTaxes", bearer: "tenant", amount: 3, purposeCategory: "taxes" },
      { purpose: "maintenance", bearer: "owner", amount: 19, purposeCategory: "site_management" },
      { purpose: "propertyTaxes", bearer: "owner", amount: 130, purposeCategory: "taxes" },
      {
        purpose: "otherManagementCosts",
        bearer: "tenant",
        amount: 15,
        purposeCategory: "site_management",
      },
      { purpose: "security", bearer: "owner", amount: 89, purposeCategory: "safety" },
      { purpose: "illegalDumpingCost", bearer: "owner", amount: 90, purposeCategory: "safety" },
      { purpose: "otherSecuringCosts", bearer: "owner", amount: 129, purposeCategory: "safety" },
      { purpose: "accidentsCost", bearer: "tenant", amount: 12, purposeCategory: "safety" },
    ]);
  });
});
