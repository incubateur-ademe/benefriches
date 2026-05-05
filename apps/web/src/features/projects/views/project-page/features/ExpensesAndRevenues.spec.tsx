import { render, screen } from "@testing-library/react";

import ExpensesAndRevenuesSection from "./ExpensesAndRevenues";

// todo-agent: add more tests for this component, especially for the other sections and for the different development plan types
describe("ExpensesAndRevenuesSection", () => {
  it("renders construction and rehabilitation expenses between reinstatement and installation costs", () => {
    const { container } = render(
      <ExpensesAndRevenuesSection
        developmentPlanType="URBAN_PROJECT"
        installationCosts={[{ purpose: "development_works", amount: 12000 }]}
        yearlyProjectedExpenses={[]}
        yearlyProjectedRevenues={[]}
        sitePurchaseTotalAmount={undefined}
        siteResaleSellingPrice={undefined}
        buildingsResaleSellingPrice={undefined}
        financialAssistanceRevenues={undefined}
        reinstatementCosts={[{ purpose: "demolition", amount: 5000 }]}
        buildingsConstructionAndRehabilitationExpenses={[
          { purpose: "technical_studies_and_fees", amount: 2000 },
          { purpose: "buildings_construction_works", amount: 3000 },
          { purpose: "buildings_rehabilitation_works", amount: 4000 },
          { purpose: "other_construction_expenses", amount: 1000 },
        ]}
        isExpress={false}
        buildingsFloorArea={{ RESIDENTIAL: 1000 }}
      />,
    );

    const text = container.textContent ?? "";

    expect(text.indexOf("Dépenses de remise en état de la friche")).toBeGreaterThan(-1);
    expect(text.indexOf("Construction / réhabilitation des bâtiments")).toBeGreaterThan(-1);
    expect(text.indexOf("Travaux d'aménagement")).toBeGreaterThan(-1);
    expect(text.indexOf("Dépenses de remise en état de la friche")).toBeLessThan(
      text.indexOf("Construction / réhabilitation des bâtiments"),
    );
    expect(text.indexOf("Construction / réhabilitation des bâtiments")).toBeLessThan(
      text.indexOf("Travaux d'aménagement"),
    );

    expect(screen.getByText("Études et honoraires techniques")).toBeVisible();
    expect(screen.getByText("Travaux de construction des bâtiments")).toBeVisible();
    expect(screen.getByText("Travaux de réhabilitation des bâtiments")).toBeVisible();
    expect(screen.getByText("Autres dépenses de construction ou de réhabilitation")).toBeVisible();
  });
});
