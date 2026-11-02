import { fireEvent, render, screen, within } from "@testing-library/react";

import SurfaceAreaPieChart from "./SurfaceAreaPieChart";

describe("SurfaceAreaPieChart", () => {
  it("shows the chart data as a table when the 'View as data table' button is activated", () => {
    render(
      <SurfaceAreaPieChart
        soilsDistribution={[
          { name: "Surface d'activité", value: 6000 },
          { name: "Espaces publics", value: 4000 },
        ]}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /View as data table/ }));

    const rows = within(screen.getByRole("table"))
      .getAllByRole<HTMLTableRowElement>("row")
      .map((row) => Array.from(row.cells, (cell) => cell.textContent));
    expect(rows).toEqual([
      ["", "Superficie"],
      ["Surface d'activité", "6,000"],
      ["Espaces publics", "4,000"],
    ]);
  });
});
