import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import VacantCommercialPremisesFootprintForm from "./VacantCommercialPremisesFootprintForm";

describe("VacantCommercialPremisesFootprintForm", () => {
  it("submits a surface area typed with a decimal comma", async () => {
    const onSubmitSpy = vi.fn();
    render(
      <VacantCommercialPremisesFootprintForm
        siteSurfaceArea={10000}
        onSubmit={onSubmitSpy}
        onBack={vi.fn()}
      />,
    );

    const input = await screen.findByRole("textbox", { name: /emprise foncière/i });
    fireEvent.input(input, { target: { value: "2,5" } });
    const submitButton = screen.getByRole("button", { name: "Valider" });
    await waitFor(() => {
      expect(submitButton).toBeEnabled();
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(onSubmitSpy).toHaveBeenCalledTimes(1);
    });
    expect(onSubmitSpy.mock.calls[0]?.[0]).toEqual({ surfaceArea: 2.5 });
  });
});
