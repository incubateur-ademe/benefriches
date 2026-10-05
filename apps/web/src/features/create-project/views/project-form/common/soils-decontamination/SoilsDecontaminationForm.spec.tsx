import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { SQUARE_METERS_HTML_SYMBOL } from "@/shared/core/format-number/formatNumber";

import SoilsDecontaminationForm from "./SoilsDecontaminationForm";

const defaultProps = {
  contaminatedSoilSurface: 1000,
  inputMode: "percentage" as const,
  onInputModeChange: vi.fn(),
  onSubmit: vi.fn(),
  onBack: vi.fn(),
};

// The next button is disabled until react-hook-form has validated the form.
const clickWhenEnabled = async (name: string) => {
  const button = screen.getByRole("button", { name });
  await waitFor(() => {
    // oxlint-disable-next-line no-standalone-expect
    expect(button).toBeEnabled();
  });
  fireEvent.click(button);
};

const getSurfaceInput = () => screen.queryByRole("textbox", { name: /part à dépolluer/i });

describe("SoilsDecontaminationForm", () => {
  it("asks whether the soils need to be decontaminated", () => {
    render(<SoilsDecontaminationForm {...defaultProps} />);

    expect(
      // The title ends with a non-breaking space before "?".
      screen.getByRole("heading", { name: /^Est-il nécessaire de dépolluer les sols\s\?$/ }),
    ).toBeInTheDocument();
  });

  it("submits 'unknown' through the 'Passer' button when nothing is selected", async () => {
    const onSubmit = vi.fn();
    render(<SoilsDecontaminationForm {...defaultProps} onSubmit={onSubmit} />);

    expect(getSurfaceInput()).not.toBeInTheDocument();
    await clickWhenEnabled("Passer");

    await waitFor(() => {
      // oxlint-disable-next-line no-standalone-expect
      expect(onSubmit).toHaveBeenCalledWith({ decontaminationPlan: "unknown" });
    });
  });

  it("reveals the surface input when 'Oui' is selected and hides it for 'Non' and 'Ne sait pas'", () => {
    render(<SoilsDecontaminationForm {...defaultProps} />);

    fireEvent.click(screen.getByLabelText("Oui"));
    expect(getSurfaceInput()).toBeInTheDocument();
    expect(screen.getByLabelText("%")).toBeChecked();
    expect(screen.getByLabelText(SQUARE_METERS_HTML_SYMBOL)).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("Non"));
    expect(getSurfaceInput()).not.toBeInTheDocument();

    fireEvent.click(screen.getByLabelText(/Ne sait pas/));
    expect(getSurfaceInput()).not.toBeInTheDocument();
  });

  it("submits 'none' when 'Non' is selected", async () => {
    const onSubmit = vi.fn();
    render(<SoilsDecontaminationForm {...defaultProps} onSubmit={onSubmit} />);

    fireEvent.click(screen.getByLabelText("Non"));
    await clickWhenEnabled("Valider");

    await waitFor(() => {
      // oxlint-disable-next-line no-standalone-expect
      expect(onSubmit).toHaveBeenCalledWith({ decontaminationPlan: "none" });
    });
  });

  it("submits 'partial' with the surface converted to square meters", async () => {
    const onSubmit = vi.fn();
    render(<SoilsDecontaminationForm {...defaultProps} onSubmit={onSubmit} />);

    fireEvent.click(screen.getByLabelText("Oui"));
    fireEvent.input(getSurfaceInput()!, { target: { value: "50" } });

    await waitFor(() => {
      // oxlint-disable-next-line no-standalone-expect
      expect(screen.getByText(/Soit/)).toContainHTML("Soit <strong>500 ㎡</strong>");
    });
    await clickWhenEnabled("Valider");

    await waitFor(() => {
      // oxlint-disable-next-line no-standalone-expect
      expect(onSubmit).toHaveBeenCalledWith({
        decontaminationPlan: "partial",
        decontaminatedSurfaceArea: 500,
      });
    });
  });

  describe("surface validation", () => {
    it("disables the next button while 'Oui' has no surface", async () => {
      render(<SoilsDecontaminationForm {...defaultProps} />);

      fireEvent.click(screen.getByLabelText("Oui"));

      await waitFor(() => {
        // oxlint-disable-next-line no-standalone-expect
        expect(screen.getByRole("button", { name: "Valider" })).toBeDisabled();
      });
    });

    it("disables the next button above 100% in percentage mode", async () => {
      render(<SoilsDecontaminationForm {...defaultProps} />);

      fireEvent.click(screen.getByLabelText("Oui"));
      fireEvent.input(getSurfaceInput()!, { target: { value: "150" } });

      await waitFor(() => {
        // oxlint-disable-next-line no-standalone-expect
        expect(screen.getByRole("button", { name: "Valider" })).toBeDisabled();
      });
    });

    it("disables the next button above the contaminated surface in square meters mode", async () => {
      render(<SoilsDecontaminationForm {...defaultProps} inputMode="squareMeters" />);

      fireEvent.click(screen.getByLabelText("Oui"));
      fireEvent.input(getSurfaceInput()!, { target: { value: "1500" } });

      await waitFor(() => {
        // oxlint-disable-next-line no-standalone-expect
        expect(screen.getByRole("button", { name: "Valider" })).toBeDisabled();
      });
    });

    it("enables the next button with a surface within the contaminated surface", async () => {
      render(<SoilsDecontaminationForm {...defaultProps} inputMode="squareMeters" />);

      fireEvent.click(screen.getByLabelText("Oui"));
      fireEvent.input(getSurfaceInput()!, { target: { value: "1000" } });

      await waitFor(() => {
        // oxlint-disable-next-line no-standalone-expect
        expect(screen.getByRole("button", { name: "Valider" })).toBeEnabled();
      });
    });
  });

  it("converts the entered value when switching from % to square meters", async () => {
    const onInputModeChange = vi.fn();
    render(<SoilsDecontaminationForm {...defaultProps} onInputModeChange={onInputModeChange} />);

    fireEvent.click(screen.getByLabelText("Oui"));
    fireEvent.input(getSurfaceInput()!, { target: { value: "50" } });
    fireEvent.click(screen.getByLabelText(SQUARE_METERS_HTML_SYMBOL));

    await waitFor(() => {
      // oxlint-disable-next-line no-standalone-expect
      expect(getSurfaceInput()).toHaveDisplayValue("500");
    });
    expect(onInputModeChange).toHaveBeenCalledWith("squareMeters");
  });

  it("drops the entered surface when switching away from 'Oui'", () => {
    render(<SoilsDecontaminationForm {...defaultProps} />);

    fireEvent.click(screen.getByLabelText("Oui"));
    fireEvent.input(getSurfaceInput()!, { target: { value: "50" } });
    fireEvent.click(screen.getByLabelText("Non"));
    fireEvent.click(screen.getByLabelText("Oui"));

    expect(getSurfaceInput()).toHaveDisplayValue("");
  });

  describe("initial values", () => {
    const partialInitialValues = {
      decontaminationPlan: "partial" as const,
      decontaminatedSurfaceArea: 600,
    };

    it("pre-selects 'Oui' with the stored surface as a percentage in percentage mode", () => {
      render(<SoilsDecontaminationForm {...defaultProps} initialValues={partialInitialValues} />);

      expect(screen.getByLabelText("Oui")).toBeChecked();
      expect(getSurfaceInput()).toHaveDisplayValue("60");
    });

    it("pre-selects 'Oui' with the stored surface in square meters mode", () => {
      render(
        <SoilsDecontaminationForm
          {...defaultProps}
          inputMode="squareMeters"
          initialValues={partialInitialValues}
        />,
      );

      expect(screen.getByLabelText("Oui")).toBeChecked();
      expect(getSurfaceInput()).toHaveDisplayValue("600");
    });

    it("resubmits the stored surface unchanged when its percentage is not a round number", async () => {
      const onSubmit = vi.fn();
      render(
        <SoilsDecontaminationForm
          {...defaultProps}
          contaminatedSoilSurface={3000}
          initialValues={{ decontaminationPlan: "partial", decontaminatedSurfaceArea: 1000 }}
          onSubmit={onSubmit}
        />,
      );

      await clickWhenEnabled("Valider");

      await waitFor(() => {
        // oxlint-disable-next-line no-standalone-expect
        expect(onSubmit).toHaveBeenCalledWith({
          decontaminationPlan: "partial",
          decontaminatedSurfaceArea: 1000,
        });
      });
    });

    it("pre-selects 'Ne sait pas' without showing the surface input", () => {
      render(
        <SoilsDecontaminationForm
          {...defaultProps}
          initialValues={{ decontaminationPlan: "unknown", decontaminatedSurfaceArea: 250 }}
        />,
      );

      expect(screen.getByLabelText(/Ne sait pas/)).toBeChecked();
      expect(getSurfaceInput()).not.toBeInTheDocument();
    });
  });
});
