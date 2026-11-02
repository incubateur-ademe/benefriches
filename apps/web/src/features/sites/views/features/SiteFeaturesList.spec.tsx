import { render, screen, within } from "@testing-library/react";
import { formatSurfaceArea } from "shared";
import { describe, expect, it, vi } from "vitest";

import type { SiteFeatures } from "../../core/site.types";
import SiteFeaturesList from "./SiteFeaturesList";

const siteFeatures: SiteFeatures = {
  id: "site-1",
  isExpressSite: false,
  address: "1 rue de la Paix",
  ownerName: "Owner",
  expenses: [],
  incomes: [],
  surfaceArea: 1000,
  soilsDistribution: { BUILDINGS: 1000 },
  name: "Mon site",
  nature: "FRICHE",
  contaminatedSurfaceArea: undefined,
  accidents: {},
};

// DataLine renders the label in <dd> and the value in <dt> of the same <dl>.
const getDataLineValue = (view: HTMLElement, label: string) =>
  within(view).getByText(label).closest("dl")?.querySelector("dt")?.textContent;

describe("SiteFeaturesList", () => {
  it("renders no Modifier button and no incomplete-step warning when sectionProps is not given (read-only site page)", () => {
    render(<SiteFeaturesList siteFeatures={siteFeatures} />);

    expect(screen.queryByRole("button", { name: /Modifier/ })).not.toBeInTheDocument();
    expect(screen.queryByText(/incomplète/)).not.toBeInTheDocument();
  });

  it("renders a Modifier button that calls the handler and shows the warning for a section with sectionProps", () => {
    const onClick = vi.fn();

    render(
      <SiteFeaturesList
        siteFeatures={siteFeatures}
        sectionProps={{
          LOCATION: {
            warning: "Cette étape est incomplète. Veuillez la compléter.",
            buttonProps: { iconId: "fr-icon-pencil-line", children: "Modifier", onClick },
          },
        }}
      />,
    );

    expect(
      screen.getByText("Cette étape est incomplète. Veuillez la compléter."),
    ).toBeInTheDocument();
    const button = screen.getByRole("button", { name: "Modifier" });
    button.click();
    expect(onClick).toHaveBeenCalledOnce();
  });

  describe("urban zone site", () => {
    const urbanZoneSiteFeatures: SiteFeatures = {
      id: "site-2",
      isExpressSite: false,
      address: "Chartres",
      ownerName: "Owner",
      expenses: [],
      incomes: [],
      surfaceArea: 10000,
      soilsDistribution: { BUILDINGS: 10000 },
      name: "ZAE Chartres",
      nature: "URBAN_ZONE",
      urbanZoneType: "ECONOMIC_ACTIVITY_ZONE",
      contaminatedSurfaceArea: undefined,
      landParcels: [],
    };

    it("shows the polluted surface entered in the wizard", () => {
      const { container } = render(
        <SiteFeaturesList
          siteFeatures={{ ...urbanZoneSiteFeatures, contaminatedSurfaceArea: 2500 }}
        />,
      );

      expect(getDataLineValue(container, "Superficie polluée")).toEqual(formatSurfaceArea(2500));
    });

    it("says no pollution was declared when the zone has no polluted surface", () => {
      const { container } = render(
        <SiteFeaturesList
          siteFeatures={{ ...urbanZoneSiteFeatures, contaminatedSurfaceArea: undefined }}
        />,
      );

      expect(getDataLineValue(container, "Superficie polluée")).toEqual(
        "Pas de pollution déclarée",
      );
    });

    it("shows the land-parcel split entered in the wizard", () => {
      const { container } = render(
        <SiteFeaturesList
          siteFeatures={{
            ...urbanZoneSiteFeatures,
            landParcels: [
              { type: "COMMERCIAL_ACTIVITY_AREA", surfaceArea: 6000 },
              { type: "PUBLIC_SPACES", surfaceArea: 4000 },
            ],
          }}
        />,
      );

      expect({
        activity: getDataLineValue(container, "Surface d'activité"),
        publicSpaces: getDataLineValue(container, "Espaces publics"),
      }).toEqual({
        activity: formatSurfaceArea(6000),
        publicSpaces: formatSurfaceArea(4000),
      });
    });
  });
});
