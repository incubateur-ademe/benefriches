import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import BuildingsFloorSurfaceAreaAllocation from "./BuildingsFloorSurfaceAreaAllocation";

describe("BuildingsFloorSurfaceAreaAllocation", () => {
  it("renders one segment per non-zero allocation, in selectedUses order", () => {
    render(
      <BuildingsFloorSurfaceAreaAllocation
        allocations={{ RESIDENTIAL: 600, OFFICES: 400 }}
        selectedUses={["OFFICES", "RESIDENTIAL"]}
        caption="Bâtiments existants"
      />,
    );

    const segments = screen.getAllByTestId(/^allocation-segment-/);
    expect(segments).toHaveLength(2);
    expect(segments[0]).toHaveAttribute("data-testid", "allocation-segment-OFFICES");
    expect(segments[1]).toHaveAttribute("data-testid", "allocation-segment-RESIDENTIAL");
  });

  it("sets segment heights proportional to allocation ratios", () => {
    render(
      <BuildingsFloorSurfaceAreaAllocation
        allocations={{ RESIDENTIAL: 750, OFFICES: 250 }}
        selectedUses={["RESIDENTIAL", "OFFICES"]}
        caption="Bâtiments existants"
      />,
    );

    expect(screen.getByTestId("allocation-segment-RESIDENTIAL")).toHaveStyle({ height: "75%" });
    expect(screen.getByTestId("allocation-segment-OFFICES")).toHaveStyle({ height: "25%" });
  });

  it("applies the correct background color per use", () => {
    render(
      <BuildingsFloorSurfaceAreaAllocation
        allocations={{ RESIDENTIAL: 100 }}
        selectedUses={["RESIDENTIAL"]}
        caption="Bâtiments existants"
      />,
    );

    expect(screen.getByTestId("allocation-segment-RESIDENTIAL")).toHaveStyle({
      backgroundColor: "#EA1447",
    });
  });

  it("hides the label when the segment is below the visibility threshold", () => {
    render(
      <BuildingsFloorSurfaceAreaAllocation
        allocations={{ RESIDENTIAL: 970, OFFICES: 30 }}
        selectedUses={["RESIDENTIAL", "OFFICES"]}
        caption="Bâtiments existants"
      />,
    );

    expect(screen.getByTestId("allocation-segment-RESIDENTIAL")).toHaveTextContent("Logements");
    expect(screen.getByTestId("allocation-segment-OFFICES")).toHaveTextContent("");
  });

  it("renders the caption with no segments when total allocated is zero", () => {
    render(
      <BuildingsFloorSurfaceAreaAllocation
        allocations={{}}
        selectedUses={["RESIDENTIAL", "OFFICES"]}
        caption="Bâtiments existants"
      />,
    );

    expect(screen.queryAllByTestId(/^allocation-segment-/)).toHaveLength(0);
    expect(screen.getByText("Bâtiments existants")).toBeInTheDocument();
  });
});
