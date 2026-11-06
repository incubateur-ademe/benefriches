import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import LandParcelBuildingsFloorAreaForm from "./LandParcelBuildingsFloorAreaForm";

const BELOW_FOOTPRINT_WARNING =
  "La surface de plancher est inférieure à la surface au sol des bâtiments. Vérifiez la valeur saisie.";

describe("LandParcelBuildingsFloorAreaForm", () => {
  it("warns without blocking when the floor area is below the buildings footprint", async () => {
    const onSubmit = vi.fn();
    render(
      <LandParcelBuildingsFloorAreaForm
        currentParcelType="COMMERCIAL_ACTIVITY_AREA"
        buildingsFootprintSurfaceArea={3000}
        onSubmit={onSubmit}
        onBack={vi.fn()}
      />,
    );

    fireEvent.change(screen.getByRole("textbox", { name: /surface de plancher/i }), {
      target: { value: "1000" },
    });

    expect(await screen.findByText(BELOW_FOOTPRINT_WARNING)).toBeInTheDocument();
    await waitFor(() => {
      // oxlint-disable-next-line no-standalone-expect
      expect(screen.getByRole("button", { name: /valider/i })).not.toBeDisabled();
    });
    fireEvent.submit(screen.getByRole("button", { name: /valider/i }));
    await waitFor(() => {
      // oxlint-disable-next-line no-standalone-expect
      expect(onSubmit).toHaveBeenCalledWith({ buildingsFloorSurfaceArea: 1000 }, expect.anything());
    });
  });

  it("shows no warning when the floor area equals the buildings footprint", async () => {
    render(
      <LandParcelBuildingsFloorAreaForm
        currentParcelType="COMMERCIAL_ACTIVITY_AREA"
        buildingsFootprintSurfaceArea={3000}
        onSubmit={vi.fn()}
        onBack={vi.fn()}
      />,
    );

    fireEvent.change(screen.getByRole("textbox", { name: /surface de plancher/i }), {
      target: { value: "3000" },
    });

    await waitFor(() => {
      // oxlint-disable-next-line no-standalone-expect
      expect(screen.getByRole("button", { name: /valider/i })).not.toBeDisabled();
    });
    expect(screen.queryByText(BELOW_FOOTPRINT_WARNING)).not.toBeInTheDocument();
  });
});
