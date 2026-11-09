import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import VacantCommercialPremisesFloorAreaForm from "./VacantCommercialPremisesFloorAreaForm";

describe("VacantCommercialPremisesFloorAreaForm", () => {
  it("submits a surface area typed with a decimal comma", async () => {
    const onSubmitSpy = vi.fn();
    render(<VacantCommercialPremisesFloorAreaForm onSubmit={onSubmitSpy} onBack={vi.fn()} />);

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
    expect(onSubmitSpy.mock.calls[0]?.[0]).toEqual({ surfaceArea: 2.5 });
  });
});
