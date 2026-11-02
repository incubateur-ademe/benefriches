import { render, screen } from "@testing-library/react";
import type { ReinstatementExpense } from "shared";
import { describe, expect, it, vi } from "vitest";

import ProjectCreationDataSummary from "./ProjectCreationDataSummary";

const renderSummary = (reinstatementExpenses: ReinstatementExpense[]) =>
  render(
    <ProjectCreationDataSummary
      projectData={{
        name: "Centrale photovoltaïque",
        developmentPlanCategory: "RENEWABLE_ENERGY",
        renewableEnergy: "PHOTOVOLTAIC_POWER_PLANT",
        photovoltaicElectricalPowerKWc: 800,
        photovoltaicSurfaceArea: 8000,
        photovoltaicExpectedAnnualProduction: 900,
        photovoltaicContractDuration: 20,
        soilsDistribution: {},
        reinstatementExpenses,
        yearlyProjectedExpenses: [],
        yearlyProjectedRevenues: [],
      }}
      siteData={{ surfaceArea: 10000, soilsDistribution: {}, name: "Zone d'activités" }}
      onNext={vi.fn()}
      onBack={vi.fn()}
      stepperGroups={[]}
      onNavigateToStep={vi.fn()}
    />,
  );

describe("ProjectCreationDataSummary (photovoltaic)", () => {
  it("shows the friche reinstatement expenses when there are some", () => {
    renderSummary([{ amount: 34500, purpose: "demolition" }]);

    expect(screen.getByText("Dépenses de remise en état de la friche")).toBeInTheDocument();
  });

  it("does not show a friche reinstatement expenses line when the project has none", () => {
    renderSummary([]);

    expect(screen.queryByText("Dépenses de remise en état de la friche")).not.toBeInTheDocument();
  });
});
