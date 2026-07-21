import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { type UrbanProjectUse } from "shared";

import UsesFloorSurfaceArea from "./UsesFloorSurfaceArea";

describe("UsesFloorSurfaceArea", () => {
  const baseProps = {
    initialValues: {
      RESIDENTIAL: 2000,
      OFFICES: 1000,
    },
    selectedUses: ["RESIDENTIAL", "OFFICES"] satisfies UrbanProjectUse[],
    onSubmit: vi.fn(),
    onBack: vi.fn(),
  };

  it("disables the Valider button when the total floor surface area is less than the buildings footprint", async () => {
    render(<UsesFloorSurfaceArea {...baseProps} buildingsFootprintSurfaceArea={4800} />);

    const [residentialInput, officesInput] = screen.getAllByRole("textbox");
    fireEvent.change(residentialInput!, { target: { value: "2000" } });
    fireEvent.change(officesInput!, { target: { value: "1000" } });

    // Wait for validation to settle (total row reflects 3000)
    await waitFor(() => {
      // oxlint-disable-next-line no-standalone-expect
      expect(screen.getByDisplayValue("3000")).toBeInTheDocument();
    });

    // Total = 3000 < footprint 4800 → Valider must be disabled
    expect(screen.getByRole("button", { name: /valider/i })).toBeDisabled();
  });

  it("does not enforce a minimum total when buildingsFootprintSurfaceArea is undefined", async () => {
    const onSubmit = vi.fn();
    render(
      <UsesFloorSurfaceArea
        {...baseProps}
        onSubmit={onSubmit}
        buildingsFootprintSurfaceArea={undefined}
      />,
    );

    const [residentialInput, officesInput] = screen.getAllByRole("textbox");
    fireEvent.change(residentialInput!, { target: { value: "1" } });
    fireEvent.change(officesInput!, { target: { value: "1" } });

    await waitFor(() => {
      // oxlint-disable-next-line no-standalone-expect
      expect(screen.getByRole("button", { name: /valider/i })).not.toBeDisabled();
    });

    fireEvent.submit(screen.getByRole("button", { name: /valider/i }));

    await waitFor(() => {
      // oxlint-disable-next-line no-standalone-expect
      expect(onSubmit).toHaveBeenCalled();
    });
  });

  it("shows an insufficient floor surface message and clears it once total reaches the footprint", async () => {
    render(<UsesFloorSurfaceArea {...baseProps} buildingsFootprintSurfaceArea={4800} />);

    const [residentialInput, officesInput] = screen.getAllByRole("textbox");
    fireEvent.change(residentialInput!, { target: { value: "2000" } });
    fireEvent.change(officesInput!, { target: { value: "1000" } });

    expect(
      await screen.findByText((content) =>
        content.includes(
          "La surface de plancher ne peut pas être inférieure à l'emprise au sol des bâtiments",
        ),
      ),
    ).toBeInTheDocument();

    fireEvent.change(officesInput!, { target: { value: "2800" } });

    await waitFor(() => {
      // oxlint-disable-next-line no-standalone-expect
      expect(
        screen.queryByText((content) =>
          content.includes(
            "La surface de plancher ne peut pas être inférieure à l'emprise au sol des bâtiments",
          ),
        ),
      ).not.toBeInTheDocument();
    });
  });

  it("enables the Valider button and submits when the total floor surface area equals the buildings footprint", async () => {
    const onSubmit = vi.fn();
    render(
      <UsesFloorSurfaceArea
        {...baseProps}
        onSubmit={onSubmit}
        buildingsFootprintSurfaceArea={3000}
      />,
    );

    const [residentialInput, officesInput] = screen.getAllByRole("textbox");
    fireEvent.change(residentialInput!, { target: { value: "2000" } });
    fireEvent.change(officesInput!, { target: { value: "1000" } });

    await waitFor(() => {
      // oxlint-disable-next-line no-standalone-expect
      expect(screen.getByRole("button", { name: /valider/i })).not.toBeDisabled();
    });

    fireEvent.submit(screen.getByRole("button", { name: /valider/i }));

    await waitFor(() => {
      // oxlint-disable-next-line no-standalone-expect
      expect(onSubmit).toHaveBeenCalledWith(
        { RESIDENTIAL: 2000, OFFICES: 1000 },
        expect.anything(),
      );
    });
  });
});
