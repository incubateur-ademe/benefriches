import { render, screen } from "@testing-library/react";
import { expect, vi } from "vitest";

import SiteSoilsCarbonStorage from "./SiteSoilsCarbonStorage";

describe("SiteSoilsCarbonStorage", () => {
  const defaultProps = {
    onNext: vi.fn(),
    onBack: vi.fn(),
    fetchSiteCarbonStorage: vi.fn(),
  };

  it("should render spinner when loading", () => {
    render(<SiteSoilsCarbonStorage {...defaultProps} loadingState="loading" />);

    expect(screen.getByText("Calcul du stockage de carbone du site...")).toBeInTheDocument();
  });

  it("should render error alert when fetch fails", () => {
    render(<SiteSoilsCarbonStorage {...defaultProps} loadingState="error" />);

    expect(screen.getByText("Erreur")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Une erreur s'est produite lors du calcul du pouvoir de stockage de carbone par les sols...",
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Suivant" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Précédent" })).toBeInTheDocument();
  });

  it("should render carbon storage data when loaded successfully", () => {
    render(
      <SiteSoilsCarbonStorage
        {...defaultProps}
        loadingState="success"
        siteCarbonStorage={{
          total: 230,
          soils: [
            {
              type: "FOREST_DECIDUOUS",
              surfaceArea: 10000,
              carbonStorage: 230,
              carbonStorageInTonPerSquareMeters: 0.023,
            },
          ],
        }}
      />,
    );

    expect(screen.getByText(/Ce site stocke environ/)).toBeInTheDocument();
    expect(screen.getByText(/C'est l'équivalent de ce qu'émettent/)).toBeInTheDocument();
  });

  it("should not render spinner or error alert when idle", () => {
    render(<SiteSoilsCarbonStorage {...defaultProps} loadingState="idle" />);

    expect(screen.queryByText("Calcul du stockage de carbone du site...")).not.toBeInTheDocument();
    expect(screen.queryByText("Erreur")).not.toBeInTheDocument();
  });
});
