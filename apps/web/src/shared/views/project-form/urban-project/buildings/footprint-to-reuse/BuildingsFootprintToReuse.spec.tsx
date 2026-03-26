import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import BuildingsFootprintToReuse from "./BuildingsFootprintToReuse";

describe("BuildingsFootprintToReuse", () => {
  const defaultProps = {
    siteBuildingsFootprint: 2000,
    initialValue: undefined,
    onSubmit: vi.fn(),
    onBack: vi.fn(),
  };

  it("should submit footprint in square meters by default", async () => {
    const onSubmit = vi.fn();
    render(<BuildingsFootprintToReuse {...defaultProps} onSubmit={onSubmit} />);

    fireEvent.change(screen.getByRole("textbox"), { target: { value: "1200" } });
    fireEvent.submit(screen.getByRole("button", { name: /valider/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({ buildingsFootprintToReuse: 1200 });
    });
  });

  it("should convert percentage to square meters on submit", async () => {
    const onSubmit = vi.fn();
    render(<BuildingsFootprintToReuse {...defaultProps} onSubmit={onSubmit} />);

    fireEvent.click(screen.getByLabelText("%"));
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "50" } });
    fireEvent.submit(screen.getByRole("button", { name: /valider/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({ buildingsFootprintToReuse: 1000 });
    });
  });

  it("should not submit when value exceeds site buildings footprint", async () => {
    const onSubmit = vi.fn();
    render(<BuildingsFootprintToReuse {...defaultProps} onSubmit={onSubmit} />);

    fireEvent.change(screen.getByRole("textbox"), { target: { value: "2500" } });
    fireEvent.submit(screen.getByRole("button", { name: /valider/i }));

    expect(
      await screen.findByText(
        "La surface réutilisée ne peut pas être supérieure à la surface de bâtiments existants disponible",
      ),
    ).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("should call onBack when previous button is clicked", () => {
    const onBack = vi.fn();
    render(<BuildingsFootprintToReuse {...defaultProps} onBack={onBack} />);

    fireEvent.click(screen.getByRole("button", { name: /précédent/i }));

    expect(onBack).toHaveBeenCalledOnce();
  });
});
