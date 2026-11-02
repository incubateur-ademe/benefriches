import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import PhotovoltaicContractDurationForm from "./ContractDurationForm";

const LONG_DURATION_WARNING =
  "Cette durée est inhabituelle. Vérifiez la valeur saisie : les impacts du projet seront calculés sur 50 ans au maximum.";

describe("PhotovoltaicContractDurationForm", () => {
  it("warns without blocking when the contract duration exceeds the 50-year evaluation period", async () => {
    const onSubmit = vi.fn();
    render(
      <PhotovoltaicContractDurationForm
        initialValues={{ photovoltaicContractDuration: 20 }}
        onSubmit={onSubmit}
        onBack={vi.fn()}
      />,
    );

    fireEvent.change(screen.getByRole("textbox", { name: /durée du contrat de revente/i }), {
      target: { value: "500" },
    });

    expect(await screen.findByText(LONG_DURATION_WARNING)).toBeInTheDocument();
    fireEvent.submit(screen.getByRole("button", { name: /valider/i }));
    await waitFor(() => {
      // oxlint-disable-next-line no-standalone-expect
      expect(onSubmit).toHaveBeenCalledWith(
        { photovoltaicContractDuration: 500 },
        expect.anything(),
      );
    });
  });

  it("shows no warning for a 50-year contract", () => {
    render(
      <PhotovoltaicContractDurationForm
        initialValues={{ photovoltaicContractDuration: 20 }}
        onSubmit={vi.fn()}
        onBack={vi.fn()}
      />,
    );

    fireEvent.change(screen.getByRole("textbox", { name: /durée du contrat de revente/i }), {
      target: { value: "50" },
    });

    expect(screen.queryByText(LONG_DURATION_WARNING)).not.toBeInTheDocument();
  });
});
