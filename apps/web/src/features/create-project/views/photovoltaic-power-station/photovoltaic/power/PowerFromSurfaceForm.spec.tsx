import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import PhotovoltaicPowerFromSurfaceForm from "./PowerFromSurfaceForm";

describe("PhotovoltaicPowerFromSurfaceForm", () => {
  it("gives the recommended maximum power in kWc, the unit of the field", () => {
    render(
      <PhotovoltaicPowerFromSurfaceForm
        recommendedElectricalPowerKWc={800}
        photovoltaicSurfaceArea={8000}
        onSubmit={vi.fn()}
        onBack={vi.fn()}
      />,
    );

    expect(screen.getByText("Maximum conseillé : 800 kWc")).toBeInTheDocument();
  });
});
