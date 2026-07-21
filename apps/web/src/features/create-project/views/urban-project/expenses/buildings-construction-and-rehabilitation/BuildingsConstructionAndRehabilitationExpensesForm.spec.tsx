import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import BuildingsConstructionAndRehabilitationExpensesForm from "./BuildingsConstructionAndRehabilitationExpensesForm";

describe("BuildingsConstructionAndRehabilitationExpensesForm", () => {
  it("submits all visible expense fields", async () => {
    const onSubmit = vi.fn();

    render(
      <BuildingsConstructionAndRehabilitationExpensesForm
        initialValues={undefined}
        hasConstruction
        hasRehabilitation
        onBack={vi.fn()}
        onSubmit={onSubmit}
      />,
    );

    fireEvent.change(screen.getByLabelText("Études et honoraires techniques"), {
      target: { value: "1000" },
    });
    fireEvent.change(screen.getByLabelText("Travaux de construction des bâtiments"), {
      target: { value: "2000" },
    });
    fireEvent.change(screen.getByLabelText("Travaux de réhabilitation des bâtiments"), {
      target: { value: "3000" },
    });
    fireEvent.change(
      screen.getByLabelText("Autres dépenses de construction ou de réhabilitation"),
      {
        target: { value: "4000" },
      },
    );

    fireEvent.submit(screen.getByRole("button", { name: /valider/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled();
      expect(onSubmit.mock.calls[0]?.[0]).toEqual({
        technicalStudiesAndFees: 1000,
        buildingsConstructionWorks: 2000,
        buildingsRehabilitationWorks: 3000,
        otherConstructionExpenses: 4000,
      });
    });
  });

  it("hides optional inputs when construction and rehabilitation are not applicable", () => {
    render(
      <BuildingsConstructionAndRehabilitationExpensesForm
        initialValues={undefined}
        hasConstruction={false}
        hasRehabilitation={false}
        onBack={vi.fn()}
        onSubmit={vi.fn()}
      />,
    );

    expect(
      screen.queryByLabelText("Travaux de construction des bâtiments"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByLabelText("Travaux de réhabilitation des bâtiments"),
    ).not.toBeInTheDocument();
    expect(screen.getByLabelText("Études et honoraires techniques")).toBeInTheDocument();
    expect(
      screen.getByLabelText("Autres dépenses de construction ou de réhabilitation"),
    ).toBeInTheDocument();
  });
});
