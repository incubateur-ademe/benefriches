import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { formatSurfaceArea } from "@/shared/core/format-number/formatNumber";

import BuildingsFootprintToReuse from "./BuildingsFootprintToReuse";

describe("BuildingsFootprintToReuse", () => {
  const defaultProps = {
    siteBuildingsFootprint: 2000,
    maxBuildingsFootprintToReuse: 2000,
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

  it("should not submit when value exceeds max footprint to reuse", async () => {
    const onSubmit = vi.fn();
    render(
      <BuildingsFootprintToReuse
        {...defaultProps}
        siteBuildingsFootprint={1000}
        maxBuildingsFootprintToReuse={900}
        onSubmit={onSubmit}
      />,
    );

    fireEvent.change(screen.getByRole("textbox"), { target: { value: "950" } });
    fireEvent.submit(screen.getByRole("button", { name: /valider/i }));

    expect(
      await screen.findByText(
        "La surface réutilisée ne peut pas être supérieure à la surface de bâti existant disponible et celle prévue dans le projet",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText(`Max ${formatSurfaceArea(900)}`)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("should call onBack when previous button is clicked", () => {
    const onBack = vi.fn();
    render(<BuildingsFootprintToReuse {...defaultProps} onBack={onBack} />);

    fireEvent.click(screen.getByRole("button", { name: /précédent/i }));

    expect(onBack).toHaveBeenCalledOnce();
  });
});
