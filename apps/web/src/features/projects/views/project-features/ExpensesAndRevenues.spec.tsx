import { render, screen } from "@testing-library/react";

import ExpensesAndRevenuesSection from "./ExpensesAndRevenues";

type SectionProps = React.ComponentProps<typeof ExpensesAndRevenuesSection>;

const defaultProps: SectionProps = {
  developmentPlanType: "URBAN_PROJECT",
  installationCosts: [],
  yearlyProjectedExpenses: [],
  yearlyProjectedRevenues: [],
  sitePurchaseTotalAmount: undefined,
  siteResaleSellingPrice: undefined,
  buildingsResaleSellingPrice: undefined,
  financialAssistanceRevenues: undefined,
  reinstatementCosts: undefined,
  buildingsConstructionAndRehabilitationExpenses: undefined,
  isExpress: false,
  buildingsFloorArea: undefined,
};

const renderSection = (overrides: Partial<SectionProps> = {}) =>
  render(<ExpensesAndRevenuesSection {...defaultProps} {...overrides} />);

describe("ExpensesAndRevenuesSection", () => {
  describe("Urban project", () => {
    it("renders the empty state when no expenses or revenues are provided", () => {
      renderSection();

      expect(screen.getByText("Aucune dépense ou revenu renseigné.")).toBeVisible();
    });

    it("renders the site purchase total amount when provided", () => {
      renderSection({ sitePurchaseTotalAmount: 250000 });

      expect(screen.getByText("Prix d'achat du site et droits de mutation")).toBeVisible();
      expect(screen.getByText("250 000 €")).toBeVisible();
    });

    it("renders reinstatement costs total and per-purpose detail rows", () => {
      renderSection({
        reinstatementCosts: [
          { purpose: "demolition", amount: 5000 },
          { purpose: "asbestos_removal", amount: 3000 },
        ],
      });

      expect(screen.getByText("Dépenses de remise en état de la friche")).toBeVisible();
      expect(screen.getByText("8 000 €")).toBeVisible();
      expect(screen.getByText("🧱 Déconstruction")).toBeVisible();
      expect(screen.getByText("☣️ Désamiantage")).toBeVisible();
      expect(screen.getByText("5 000 €")).toBeVisible();
      expect(screen.getByText("3 000 €")).toBeVisible();
    });

    it("renders the site resale price when provided", () => {
      renderSection({ siteResaleSellingPrice: 150000 });

      expect(screen.getByText("Prix de revente du site")).toBeVisible();
      expect(screen.getByText("150 000 €")).toBeVisible();
    });

    it("renders the buildings resale price when provided", () => {
      renderSection({ buildingsResaleSellingPrice: 420000 });

      expect(screen.getByText("Prix de revente des bâtiments")).toBeVisible();
      expect(screen.getByText("420 000 €")).toBeVisible();
    });

    it("renders financial assistance revenues total and per-source detail rows", () => {
      renderSection({
        financialAssistanceRevenues: [
          { source: "public_subsidies", amount: 20000 },
          { source: "local_or_regional_authority_participation", amount: 10000 },
        ],
      });

      expect(screen.getByText("Aides financières")).toBeVisible();
      expect(screen.getByText("30 000 €")).toBeVisible();
      expect(screen.getByText("Subventions publiques")).toBeVisible();
      expect(screen.getByText("Participation des collectivités")).toBeVisible();
    });

    it("renders yearly projected revenues total and per-source detail rows", () => {
      renderSection({
        yearlyProjectedRevenues: [
          { source: "rent", amount: 8000 },
          { source: "operations", amount: 4000 },
        ],
      });

      expect(screen.getByText("Recettes annuelles")).toBeVisible();
      expect(screen.getByText("12 000 €")).toBeVisible();
      expect(screen.getByText("Revenu locatif")).toBeVisible();
      expect(screen.getByText("Recettes d'exploitation")).toBeVisible();
    });

    it("uses the urban yearly projected expenses label and renders per-purpose detail rows", () => {
      renderSection({
        yearlyProjectedExpenses: [
          { purpose: "taxes", amount: 1000 },
          { purpose: "maintenance", amount: 2000 },
        ],
      });

      expect(screen.getByText("Dépenses annuelles d'exploitation des bâtiments")).toBeVisible();
      expect(screen.queryByText("Dépenses annuelles")).not.toBeInTheDocument();
      expect(screen.getByText("3 000 €")).toBeVisible();
      expect(screen.getByText("Impôts et taxes")).toBeVisible();
      expect(screen.getByText("Maintenance")).toBeVisible();
    });

    it("renders construction and rehabilitation expenses between reinstatement and installation costs", () => {
      const { container } = render(
        <ExpensesAndRevenuesSection
          {...defaultProps}
          installationCosts={[{ purpose: "development_works", amount: 12000 }]}
          reinstatementCosts={[{ purpose: "demolition", amount: 5000 }]}
          buildingsConstructionAndRehabilitationExpenses={[
            { purpose: "technical_studies_and_fees", amount: 2000 },
            { purpose: "buildings_construction_works", amount: 3000 },
            { purpose: "buildings_rehabilitation_works", amount: 4000 },
            { purpose: "other_construction_expenses", amount: 1000 },
          ]}
          buildingsFloorArea={{ RESIDENTIAL: 1000 }}
        />,
      );

      const text = container.textContent ?? "";

      expect(text.indexOf("Dépenses de remise en état de la friche")).toBeGreaterThan(-1);
      expect(text.indexOf("Construction / réhabilitation des bâtiments")).toBeGreaterThan(-1);
      expect(text.indexOf("Dépenses d'aménagement du projet urbain")).toBeGreaterThan(-1);
      expect(text.indexOf("Dépenses de remise en état de la friche")).toBeLessThan(
        text.indexOf("Construction / réhabilitation des bâtiments"),
      );
      expect(text.indexOf("Construction / réhabilitation des bâtiments")).toBeLessThan(
        text.indexOf("Dépenses d'aménagement du projet urbain"),
      );

      expect(screen.getByText("📋 Études et honoraires techniques")).toBeVisible();
      expect(screen.getByText("🧱 Travaux de construction des bâtiments")).toBeVisible();
      expect(screen.getByText("🏚 Travaux de réhabilitation des bâtiments")).toBeVisible();
      expect(
        screen.getByText("🏗️ Autres dépenses de construction ou de réhabilitation"),
      ).toBeVisible();
    });

    it("shows €/m²SDP tooltip on the site resale price when isExpress and buildingsFloorArea is provided", () => {
      const { container } = renderSection({
        isExpress: true,
        siteResaleSellingPrice: 200000,
        buildingsFloorArea: { RESIDENTIAL: 1000 },
      });

      // 200000 / 1000 = 200 €/m²SDP
      expect(container.textContent).toContain("200 €/m²SDP");
    });

    it("does not show €/m²SDP tooltip when prerequisites are not met", () => {
      const { container: notExpressContainer } = renderSection({
        isExpress: false,
        siteResaleSellingPrice: 200000,
        buildingsFloorArea: { RESIDENTIAL: 1000 },
      });
      expect(notExpressContainer.textContent ?? "").not.toContain("€/m²SDP");

      const { container: noFloorAreaContainer } = renderSection({
        isExpress: true,
        siteResaleSellingPrice: 200000,
        buildingsFloorArea: undefined,
      });
      expect(noFloorAreaContainer.textContent ?? "").not.toContain("€/m²SDP");
    });
  });

  describe("Photovoltaic power plant", () => {
    const photovoltaicDefaults: Partial<SectionProps> = {
      developmentPlanType: "PHOTOVOLTAIC_POWER_PLANT",
      buildingsConstructionAndRehabilitationExpenses: undefined,
      buildingsFloorArea: undefined,
    };

    it("renders the photovoltaic installation costs section without the urban buildings block", () => {
      renderSection({
        ...photovoltaicDefaults,
        installationCosts: [{ purpose: "installation_works", amount: 50000 }],
      });

      expect(
        screen.getByText("Dépenses d'installation de la centrale photovoltaïque"),
      ).toBeVisible();
      expect(screen.queryByText("Dépenses d'aménagement du projet urbain")).not.toBeInTheDocument();
      expect(
        screen.queryByText("Construction / réhabilitation des bâtiments"),
      ).not.toBeInTheDocument();
    });

    it("uses the generic 'Dépenses annuelles' label for yearly projected expenses", () => {
      renderSection({
        ...photovoltaicDefaults,
        yearlyProjectedExpenses: [{ purpose: "maintenance", amount: 1500 }],
      });

      expect(screen.getByText("Dépenses annuelles")).toBeVisible();
      expect(
        screen.queryByText("Dépenses annuelles d'exploitation des bâtiments"),
      ).not.toBeInTheDocument();
    });

    it("does not show the €/m²SDP tooltip on site resale price even when isExpress is true", () => {
      const { container } = renderSection({
        ...photovoltaicDefaults,
        isExpress: true,
        siteResaleSellingPrice: 200000,
        buildingsFloorArea: { RESIDENTIAL: 1000 },
      });

      expect(screen.getByText("Prix de revente du site")).toBeVisible();
      expect(container.textContent ?? "").not.toContain("€/m²SDP");
    });
  });
});
