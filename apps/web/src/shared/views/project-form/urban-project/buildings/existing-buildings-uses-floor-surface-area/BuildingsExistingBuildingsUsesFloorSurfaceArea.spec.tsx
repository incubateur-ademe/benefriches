import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { type UrbanProjectUseWithBuilding } from "shared";

import BuildingsExistingBuildingsUsesFloorSurfaceArea from "./BuildingsExistingBuildingsUsesFloorSurfaceArea";

describe("BuildingsExistingBuildingsUsesFloorSurfaceArea", () => {
  const defaultProps = {
    initialValues: {
      RESIDENTIAL: 1800,
    },
    selectedUses: ["RESIDENTIAL", "OFFICES"] satisfies UrbanProjectUseWithBuilding[],
    usesFloorSurfaceAreaDistribution: {
      RESIDENTIAL: 2400,
      OFFICES: 600,
    },
    onSubmit: vi.fn(),
    onBack: vi.fn(),
  };

  it("renders the selected building uses and overall floor surface recap", async () => {
    render(<BuildingsExistingBuildingsUsesFloorSurfaceArea {...defaultProps} />);

    await waitFor(() => {
      // oxlint-disable-next-line no-standalone-expect
      expect(screen.getAllByRole("textbox")).toHaveLength(3);
    });
    expect(
      screen.getByRole("heading", {
        name: "Quels usages accueilleront les bâtiments existants ?",
      }),
    ).toBeInTheDocument();
    expect(screen.getAllByText("Logements").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Bureaux").length).toBeGreaterThan(0);
    expect(screen.getByText("Répartition globale prévue :")).toBeInTheDocument();
  });

  it("submits the existing buildings uses distribution", async () => {
    const onSubmit = vi.fn();
    render(
      <BuildingsExistingBuildingsUsesFloorSurfaceArea {...defaultProps} onSubmit={onSubmit} />,
    );

    const [residentialInput, officesInput] = screen.getAllByRole("textbox");
    fireEvent.change(residentialInput!, { target: { value: "2000" } });
    fireEvent.change(officesInput!, { target: { value: "400" } });

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /valider/i })).not.toBeDisabled();
    });

    fireEvent.submit(screen.getByRole("button", { name: /valider/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        {
          RESIDENTIAL: 2000,
          OFFICES: 400,
        },
        expect.anything(),
      );
    });
  });

  it("does not submit when a use exceeds the overall floor surface distribution", async () => {
    const onSubmit = vi.fn();
    render(
      <BuildingsExistingBuildingsUsesFloorSurfaceArea {...defaultProps} onSubmit={onSubmit} />,
    );

    const [residentialInput] = screen.getAllByRole("textbox");
    fireEvent.change(residentialInput!, { target: { value: "2500" } });
    fireEvent.submit(screen.getByRole("button", { name: /valider/i }));

    expect(
      await screen.findByText((content) =>
        content.includes("La surface ne peut pas dépasser celle prévue pour cet usage"),
      ),
    ).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
