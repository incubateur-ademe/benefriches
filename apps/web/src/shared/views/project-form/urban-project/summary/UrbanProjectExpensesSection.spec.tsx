import { render, screen } from "@testing-library/react";

import UrbanProjectExpensesSection from "./UrbanProjectExpensesSection";

describe("UrbanProjectExpensesSection", () => {
  it("displays construction and rehabilitation expenses in the wizard summary", () => {
    render(
      <UrbanProjectExpensesSection
        sitePurchaseTotalAmount={{ shouldDisplay: false, value: undefined, isAuto: false }}
        sitePurchasePropertyTransferDuties={{
          shouldDisplay: false,
          value: undefined,
          isAuto: false,
        }}
        reinstatementCosts={{
          shouldDisplay: false,
          value: undefined,
          isAuto: false,
          autoValues: undefined,
        }}
        buildingsConstructionAndRehabilitationCosts={{
          shouldDisplay: true,
          value: {
            technicalStudiesAndFees: 10000,
            buildingsConstructionWorks: 20000,
            buildingsRehabilitationWorks: 30000,
            otherConstructionExpenses: 40000,
          },
        }}
        installationCosts={{ value: [], isAuto: false, autoValues: undefined }}
        yearlyProjectedCosts={{ value: [], isAuto: false }}
        developerName="La SPL"
        reinstatementContractOwnerName={undefined}
      />,
    );

    expect(screen.getByText("Construction / réhabilitation des bâtiments")).toBeVisible();
    expect(screen.getByText("Études et honoraires techniques")).toBeVisible();
    expect(screen.getByText("Travaux de construction des bâtiments")).toBeVisible();
    expect(screen.getByText("Travaux de réhabilitation des bâtiments")).toBeVisible();
    expect(screen.getByText("Autres dépenses de construction ou de réhabilitation")).toBeVisible();

    expect(screen.getByText(/10\s*000\s*€/)).toBeVisible();
    expect(screen.getByText(/20\s*000\s*€/)).toBeVisible();
    expect(screen.getByText(/30\s*000\s*€/)).toBeVisible();
    expect(screen.getByText(/40\s*000\s*€/)).toBeVisible();
  });
});
