import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import LandParcelBuildingsFloorAreaForm from "./LandParcelBuildingsFloorAreaForm";

describe("LandParcelBuildingsFloorAreaForm", () => {
  it("submits a surface area typed with a decimal comma", async () => {
    const onSubmitSpy = vi.fn();
    render(
      <LandParcelBuildingsFloorAreaForm
        currentParcelType="PUBLIC_SPACES"
        buildingsFootprintSurfaceArea={1000}
        onSubmit={onSubmitSpy}
        onBack={vi.fn()}
      />,
    );

    const input = await screen.findByRole("textbox", { name: /surface de plancher/i });
    fireEvent.input(input, { target: { value: "2,5" } });
    const submitButton = screen.getByRole("button", { name: "Valider" });
    await waitFor(() => {
      expect(submitButton).toBeEnabled();
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(onSubmitSpy).toHaveBeenCalledTimes(1);
    });
    expect(onSubmitSpy.mock.calls[0]?.[0]).toEqual({ buildingsFloorSurfaceArea: 2.5 });
  });
});
