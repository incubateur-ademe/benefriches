import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";

import { formatSurfaceArea } from "@/shared/core/format-number/formatNumber";

import NonSuitableSoilsSurfaceToTransformForm from "./NonSuitableSoilsSurfaceToTransformForm";

describe("NonSuitableSoilsSurfaceToTransformForm", () => {
  const defaultProps = {
    initialValues: { soilsTransformation: { BUILDINGS: 0, FOREST_MIXED: 0 } },
    soilsToTransform: [
      { soilType: "BUILDINGS" as const, currentSurfaceArea: 1000 },
      { soilType: "FOREST_MIXED" as const, currentSurfaceArea: 2000 },
    ],
    missingSuitableSurfaceArea: 1800,
    onSubmit: vi.fn(),
    onBack: vi.fn(),
  };

  it("should not allow validating when less than the missing suitable surface is transformed", async () => {
    const onSubmit = vi.fn();
    render(<NonSuitableSoilsSurfaceToTransformForm {...defaultProps} onSubmit={onSubmit} />);

    const [buildingsInput] = screen.getAllByRole("textbox");
    await act(async () => {
      fireEvent.change(buildingsInput!, { target: { value: "500" } });
    });
    await act(async () => {
      fireEvent.submit(screen.getByRole("button", { name: /valider/i }));
    });

    expect(screen.getByRole("button", { name: /valider/i })).toBeDisabled();
    expect(
      screen.getByText(`${formatSurfaceArea(1300)} manquants`, { normalizer: (text) => text }),
    ).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("should tell the user to select other spaces when the selected ones cannot cover the missing suitable surface", () => {
    render(
      <NonSuitableSoilsSurfaceToTransformForm
        {...defaultProps}
        initialValues={{ soilsTransformation: { BUILDINGS: 0 } }}
        soilsToTransform={[{ soilType: "BUILDINGS", currentSurfaceArea: 1000 }]}
        missingSuitableSurfaceArea={1800}
      />,
    );

    expect(
      screen.getByText(
        "Les espaces sélectionnés ne suffisent pas : revenez à l'étape précédente pour sélectionner d'autres espaces à supprimer.",
      ),
    ).toBeInTheDocument();
  });

  it("should submit the surfaces to transform when they reach the missing suitable surface", async () => {
    const onSubmit = vi.fn();
    render(<NonSuitableSoilsSurfaceToTransformForm {...defaultProps} onSubmit={onSubmit} />);

    const [buildingsInput, forestInput] = screen.getAllByRole("textbox");
    fireEvent.change(buildingsInput!, { target: { value: "1000" } });
    fireEvent.change(forestInput!, { target: { value: "800" } });
    fireEvent.submit(screen.getByRole("button", { name: /valider/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        soilsTransformation: { BUILDINGS: 1000, FOREST_MIXED: 800 },
      });
    });
  });
});
