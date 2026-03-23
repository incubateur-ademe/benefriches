import { FormValues } from "./SiteYearlyIncomeForm";
import { mapFormDataToIncomes, getInitialValues, mapIncomesListToFormValues } from "./mappers";

describe("Site yearly incomes mappers", () => {
  it("returns empty array when no income", () => {
    expect(
      mapFormDataToIncomes({
        subsidies: undefined,
        "product-sales": 0,
        other: undefined,
      }),
    ).toEqual([
      { source: "subsidies", amount: 0 },
      { source: "product-sales", amount: 0 },
      { source: "other", amount: 0 },
    ]);
  });

  it("returns array with subsidies, product-sales and other incomes", () => {
    const formData: FormValues = {
      subsidies: 30000,
      "product-sales": 40000,
      other: 550,
    };
    expect(mapFormDataToIncomes(formData)).toEqual([
      { source: "subsidies", amount: 30000 },
      { source: "product-sales", amount: 40000 },
      { source: "other", amount: 550 },
    ]);
  });

  it("returns formValues from incomes array", () => {
    expect(
      mapIncomesListToFormValues([
        { source: "subsidies", amount: 30000 },
        { source: "product-sales", amount: 40000 },
        { source: "other", amount: 550 },
      ]),
    ).toEqual({
      subsidies: 30000,
      "product-sales": 40000,
      other: 550,
    });

    expect(
      mapIncomesListToFormValues([
        { source: "product-sales", amount: 40000 },
        { source: "other", amount: 550 },
      ]),
    ).toEqual({
      subsidies: 0,
      "product-sales": 40000,
      other: 550,
    });
  });

  it("returns predefinedIncomes as initialValues", () => {
    expect(
      getInitialValues(
        [
          { source: "product-sales", amount: 40000 },
          { source: "subsidies", amount: 30000 },
          { source: "other", amount: 550 },
        ],
        [
          { source: "product-sales", amount: 40000 },
          { source: "subsidies", amount: 5000 },
          { source: "other", amount: 200 },
        ],
      ),
    ).toEqual({
      "product-sales": 40000,
      subsidies: 30000,
      other: 550,
    });

    expect(
      getInitialValues(
        [
          { source: "subsidies", amount: 30000 },
          { source: "other", amount: 550 },
        ],
        [
          { source: "subsidies", amount: 5000 },
          { source: "product-sales", amount: 40000 },
          { source: "other", amount: 200 },
        ],
      ),
    ).toEqual({
      "product-sales": 0,
      subsidies: 30000,
      other: 550,
    });
  });

  it("returns estimated amounts as initialValues if there is no predefinedIncomes", () => {
    expect(
      getInitialValues(
        [],
        [
          { source: "subsidies", amount: 5000 },
          { source: "product-sales", amount: 40000 },
          { source: "other", amount: 200 },
        ],
      ),
    ).toEqual({
      "product-sales": 40000,
      subsidies: 5000,
      other: 200,
    });
  });
});
