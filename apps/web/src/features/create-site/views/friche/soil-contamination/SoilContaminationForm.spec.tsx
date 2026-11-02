import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import SoilContaminationForm from "./SoilContaminationForm";

describe("SoilContaminationForm", () => {
  it("saves a skipped step as 'Non' (no contaminated soils)", async () => {
    const onSubmit = vi.fn();
    render(
      <SoilContaminationForm
        title="Les sols de la zone sont-ils pollués ?"
        siteSurfaceArea={10000}
        initialValues={{ hasContaminatedSoils: undefined, contaminatedSoilSurface: undefined }}
        onSubmit={onSubmit}
        onBack={vi.fn()}
      />,
    );

    const skipButton = screen.getByRole("button", { name: "Passer" });
    await waitFor(() => {
      expect(skipButton).toBeEnabled();
    });
    fireEvent.click(skipButton);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        hasContaminatedSoils: false,
        contaminatedSoilSurface: undefined,
      });
    });
  });
});
