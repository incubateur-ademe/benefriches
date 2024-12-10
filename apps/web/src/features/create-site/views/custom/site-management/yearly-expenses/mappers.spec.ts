import { FormValues } from "./SiteYearlyExpensesForm";
import { mapFormDataToExpenses } from "./mappers";

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
          { purpose: "rent", fixedBearer: "tenant" },
          { purpose: "operationsTaxes", fixedBearer: "tenant" },
          { purpose: "maintenance", fixedBearer: "tenant" },
          { purpose: "propertyTaxes", fixedBearer: "owner" },
          { purpose: "otherManagementCosts", fixedBearer: "tenant" },
          { purpose: "security", fixedBearer: "owner" },
          { purpose: "illegalDumpingCost", fixedBearer: "owner" },
          { purpose: "accidentsCost", fixedBearer: "owner" },
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
        { purpose: "rent", fixedBearer: "tenant" },
        { purpose: "operationsTaxes", fixedBearer: "tenant" },
        { purpose: "maintenance", fixedBearer: "tenant" },
        { purpose: "propertyTaxes", fixedBearer: "owner" },
        { purpose: "otherManagementCosts", fixedBearer: "tenant" },
        { purpose: "security", fixedBearer: "owner" },
        { purpose: "illegalDumpingCost", fixedBearer: "owner" },
        { purpose: "otherSecuringCosts", fixedBearer: "tenant" },
        { purpose: "accidentsCost", fixedBearer: "owner" },
      ]),
    ).toEqual([
      { purpose: "rent", bearer: "tenant", amount: 140 },
      { purpose: "propertyTaxes", bearer: "owner", amount: 130 },
      { purpose: "security", bearer: "owner", amount: 89 },
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
        { purpose: "rent", fixedBearer: "tenant" },
        { purpose: "operationsTaxes", fixedBearer: "tenant" },
        { purpose: "maintenance", fixedBearer: "tenant" },
        { purpose: "propertyTaxes", fixedBearer: "owner" },
        { purpose: "otherManagementCosts", fixedBearer: "tenant" },
        { purpose: "security", fixedBearer: "owner" },
        { purpose: "illegalDumpingCost", fixedBearer: "owner" },
        { purpose: "otherSecuringCosts", fixedBearer: "tenant" },
        { purpose: "accidentsCost", fixedBearer: "owner" },
      ]),
    ).toEqual([
      { purpose: "rent", bearer: "tenant", amount: 140 },
      { purpose: "operationsTaxes", bearer: "tenant", amount: 3 },
      { purpose: "maintenance", bearer: "tenant", amount: 19 },
      { purpose: "propertyTaxes", bearer: "owner", amount: 130 },
      {
        purpose: "otherManagementCosts",
        bearer: "tenant",
        amount: 15,
      },
      { purpose: "security", bearer: "owner", amount: 89 },
      { purpose: "illegalDumpingCost", bearer: "owner", amount: 90 },
      { purpose: "otherSecuringCosts", bearer: "tenant", amount: 129 },
      { purpose: "accidentsCost", bearer: "owner", amount: 12 },
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
        { purpose: "rent", fixedBearer: "owner" },
        { purpose: "operationsTaxes", fixedBearer: "owner" },
        { purpose: "maintenance", fixedBearer: "owner" },
        { purpose: "propertyTaxes", fixedBearer: "owner" },
        { purpose: "otherManagementCosts", fixedBearer: "owner" },
        { purpose: "security", fixedBearer: "owner" },
        { purpose: "illegalDumpingCost", fixedBearer: "owner" },
        { purpose: "otherSecuringCosts", fixedBearer: "owner" },
        { purpose: "accidentsCost", fixedBearer: "owner" },
      ]),
    ).toEqual([
      { purpose: "maintenance", bearer: "owner", amount: 19 },
      { purpose: "propertyTaxes", bearer: "owner", amount: 130 },
      {
        purpose: "otherManagementCosts",
        bearer: "owner",
        amount: 15,
      },
      { purpose: "security", bearer: "owner", amount: 89 },
      { purpose: "illegalDumpingCost", bearer: "owner", amount: 90 },
      { purpose: "otherSecuringCosts", bearer: "owner", amount: 129 },
      { purpose: "accidentsCost", bearer: "owner", amount: 12 },
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
        { purpose: "rent", fixedBearer: "tenant" },
        { purpose: "operationsTaxes", fixedBearer: "tenant" },
        { purpose: "maintenance", fixedBearer: "owner" },
        { purpose: "propertyTaxes", fixedBearer: "owner" },
        { purpose: "otherManagementCosts", fixedBearer: null },
        { purpose: "security", fixedBearer: null },
        { purpose: "illegalDumpingCost", fixedBearer: null },
        { purpose: "otherSecuringCosts", fixedBearer: null },
        { purpose: "accidentsCost", fixedBearer: null },
      ]),
    ).toEqual([
      { purpose: "rent", bearer: "tenant", amount: 140 },
      { purpose: "operationsTaxes", bearer: "tenant", amount: 3 },
      { purpose: "maintenance", bearer: "owner", amount: 19 },
      { purpose: "propertyTaxes", bearer: "owner", amount: 130 },
      {
        purpose: "otherManagementCosts",
        bearer: "tenant",
        amount: 15,
      },
      { purpose: "security", bearer: "owner", amount: 89 },
      { purpose: "illegalDumpingCost", bearer: "owner", amount: 90 },
      { purpose: "otherSecuringCosts", bearer: "owner", amount: 129 },
      { purpose: "accidentsCost", bearer: "tenant", amount: 12 },
    ]);
  });
});
