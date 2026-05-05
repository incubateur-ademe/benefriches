import React from "react";

import ProjectExpensesAndIncomesPdf from "./ProjectExpensesAndIncomesPdf";

function collectText(node: React.ReactNode): string[] {
  if (node === null || node === undefined || typeof node === "boolean") {
    return [];
  }

  if (typeof node === "string" || typeof node === "number") {
    return [String(node)];
  }

  if (Array.isArray(node)) {
    return node.flatMap(collectText);
  }

  if (!React.isValidElement(node)) {
    return [];
  }

  type AnyProps = Record<string, unknown> & { children?: React.ReactNode };
  const element = node as React.ReactElement<AnyProps>;
  const componentName = typeof element.type === "function" ? element.type.name : undefined;
  const shouldResolveComponent =
    typeof element.type === "function" &&
    !["Text", "View", "Page", "Document", "Image"].includes(componentName ?? "");

  if (shouldResolveComponent) {
    const Component = element.type as (props: AnyProps) => React.ReactNode;
    return collectText(Component(element.props));
  }

  return collectText(element.props.children);
}

describe("ProjectExpensesAndIncomesPdf", () => {
  it("renders construction and rehabilitation expenses between reinstatement and installation costs", () => {
    const props = {
      developmentPlanType: "URBAN_PROJECT" as const,
      developmentPlanInstallationExpenses: [
        { purpose: "development_works", amount: 12000 },
      ] as unknown as React.ComponentProps<
        typeof ProjectExpensesAndIncomesPdf
      >["developmentPlanInstallationExpenses"],
      yearlyProjectedExpenses: [],
      yearlyProjectedRevenues: [],
      sitePurchaseTotalAmount: undefined,
      siteResaleSellingPrice: undefined,
      buildingsResaleSellingPrice: undefined,
      financialAssistanceRevenues: undefined,
      reinstatementCosts: [{ purpose: "demolition", amount: 5000 }] as unknown as NonNullable<
        React.ComponentProps<typeof ProjectExpensesAndIncomesPdf>["reinstatementCosts"]
      >,
      buildingsConstructionAndRehabilitationExpenses: [
        { purpose: "technical_studies_and_fees", amount: 2000 },
        { purpose: "buildings_construction_works", amount: 3000 },
        { purpose: "buildings_rehabilitation_works", amount: 4000 },
        { purpose: "other_construction_expenses", amount: 1000 },
      ],
    };

    const text = collectText(ProjectExpensesAndIncomesPdf(props)).join(" ");

    expect(text).toContain("Dépenses de remise en état de la friche");
    expect(text).toContain("Construction / réhabilitation des bâtiments");
    expect(text).toContain("Dépenses d'aménagement du projet urbain");
    expect(text).toContain("Études et honoraires techniques");
    expect(text).toContain("Travaux de construction des bâtiments");
    expect(text).toContain("Travaux de réhabilitation des bâtiments");
    expect(text).toContain("Autres dépenses de construction ou de réhabilitation");

    expect(text.indexOf("Dépenses de remise en état de la friche")).toBeLessThan(
      text.indexOf("Construction / réhabilitation des bâtiments"),
    );
    expect(text.indexOf("Construction / réhabilitation des bâtiments")).toBeLessThan(
      text.indexOf("Dépenses d'aménagement du projet urbain"),
    );
  });
});
