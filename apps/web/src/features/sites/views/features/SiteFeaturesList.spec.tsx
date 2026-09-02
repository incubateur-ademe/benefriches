import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { SiteFeatures } from "../../core/site.types";
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
});
