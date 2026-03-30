import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { type BuildingsUseDistribution, type UrbanProjectUseWithBuilding } from "shared";

import BuildingsNewBuildingsUsesFloorSurfaceArea from "./BuildingsNewBuildingsUsesFloorSurfaceArea";

describe("BuildingsNewBuildingsUsesFloorSurfaceArea", () => {
  const defaultProps = {
    initialValues: {
      RESIDENTIAL: 800,
    } satisfies BuildingsUseDistribution,
    selectedUses: ["RESIDENTIAL", "OFFICES"] satisfies UrbanProjectUseWithBuilding[],
    usesFloorSurfaceAreaDistribution: {
      RESIDENTIAL: 2400,
      OFFICES: 600,
    } satisfies BuildingsUseDistribution,
    remainingUsesFloorSurfaceAreaDistribution: {
      RESIDENTIAL: 800,
      OFFICES: 200,
    } satisfies BuildingsUseDistribution,
    onSubmit: vi.fn(),
    onBack: vi.fn(),
  };

  it("renders the selected building uses and overall floor surface recap", async () => {
    await act(async () => {
      render(<BuildingsNewBuildingsUsesFloorSurfaceArea {...defaultProps} />);
    });

    expect(
      screen.getByRole("heading", {
        name: "Quels usages accueilleront les nouveaux bâtiments ?",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Logements")).toBeInTheDocument();
    expect(screen.getByText("Bureaux")).toBeInTheDocument();
    expect(screen.getByText("Répartition globale prévue :")).toBeInTheDocument();
    expect(screen.getAllByRole("textbox")).toHaveLength(3);
  });

  it("submits the new buildings uses distribution", async () => {
    const onSubmit = vi.fn();

    await act(async () => {
      render(<BuildingsNewBuildingsUsesFloorSurfaceArea {...defaultProps} onSubmit={onSubmit} />);
    });

    const [residentialInput, officesInput] = screen.getAllByRole("textbox");
    fireEvent.change(residentialInput!, { target: { value: "800" } });
    fireEvent.change(officesInput!, { target: { value: "200" } });

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /valider/i })).not.toBeDisabled();
    });

    fireEvent.submit(screen.getByRole("button", { name: /valider/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        {
          RESIDENTIAL: 800,
          OFFICES: 200,
        },
        expect.anything(),
      );
    });
  });

  it("does not submit when a use exceeds the remaining floor surface distribution", async () => {
    const onSubmit = vi.fn();

    await act(async () => {
      render(<BuildingsNewBuildingsUsesFloorSurfaceArea {...defaultProps} onSubmit={onSubmit} />);
    });

    const [residentialInput] = screen.getAllByRole("textbox");
    fireEvent.change(residentialInput!, { target: { value: "801" } });
    fireEvent.submit(screen.getByRole("button", { name: /valider/i }));

    expect(
      await screen.findByText((content) =>
        content.includes("La surface ne peut pas dépasser celle restant à affecter pour cet usage"),
      ),
    ).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
