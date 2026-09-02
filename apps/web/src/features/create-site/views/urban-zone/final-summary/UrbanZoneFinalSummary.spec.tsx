import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { UrbanZoneFinalSummaryViewData } from "../../../core/urban-zone/steps/final-summary/finalSummary.selectors";
import UrbanZoneFinalSummary from "./UrbanZoneFinalSummary";

const viewData: UrbanZoneFinalSummaryViewData = {
  address: "1 rue de la Paix",
  urbanZoneType: "ECONOMIC_ACTIVITY_ZONE",
  totalSurfaceArea: 5000,
  parcelSurfaceAreas: { COMMERCIAL_ACTIVITY_AREA: 5000 },
  soilsDistribution: { BUILDINGS: 5000 },
  hasContaminatedSoils: false,
  managerStructureType: "activity_park_manager",
  managerName: "Manager",
  siteName: "Ma zone urbaine",
};

describe("UrbanZoneFinalSummary", () => {
  it("renders a Modifier button for every section, and clicking the Surfaces foncières one calls the handler with the land-parcels step id", () => {
    const onNavigateLandParcels = vi.fn();

    render(
      <UrbanZoneFinalSummary
        {...viewData}
        onNext={() => {}}
        onBack={() => {}}
        sectionProps={{
          LOCATION: {
            buttonProps: { iconId: "fr-icon-pencil-line", children: "Modifier", onClick: () => {} },
          },
          LAND_PARCELS: {
            buttonProps: {
              iconId: "fr-icon-pencil-line",
              children: "Modifier",
              onClick: () => {
                onNavigateLandParcels("URBAN_ZONE_LAND_PARCELS_SELECTION");
              },
            },
          },
          SOILS: {
            buttonProps: { iconId: "fr-icon-pencil-line", children: "Modifier", onClick: () => {} },
          },
          CONTAMINATION: {
            buttonProps: { iconId: "fr-icon-pencil-line", children: "Modifier", onClick: () => {} },
          },
          MANAGEMENT: {
            buttonProps: { iconId: "fr-icon-pencil-line", children: "Modifier", onClick: () => {} },
          },
          NAMING: {
            buttonProps: { iconId: "fr-icon-pencil-line", children: "Modifier", onClick: () => {} },
          },
        }}
      />,
    );

    const modifierButtons = screen.getAllByRole("button", { name: "Modifier" });
    expect(modifierButtons).toHaveLength(6);

    modifierButtons[1]?.click();
    expect(onNavigateLandParcels).toHaveBeenCalledExactlyOnceWith(
      "URBAN_ZONE_LAND_PARCELS_SELECTION",
    );
  });

  it("renders the incomplete-step warning for a section whose sectionProps carry one", () => {
    render(
      <UrbanZoneFinalSummary
        {...viewData}
        onNext={() => {}}
        onBack={() => {}}
        sectionProps={{
          MANAGEMENT: { warning: "Cette étape est incomplète. Veuillez la compléter." },
        }}
      />,
    );

    expect(
      screen.getByText("Cette étape est incomplète. Veuillez la compléter."),
    ).toBeInTheDocument();
  });

  it("renders no Modifier button when sectionProps is not given", () => {
    render(<UrbanZoneFinalSummary {...viewData} onNext={() => {}} onBack={() => {}} />);

    expect(screen.queryByRole("button", { name: "Modifier" })).not.toBeInTheDocument();
  });
});
