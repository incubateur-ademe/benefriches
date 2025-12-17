import { screen, fireEvent, waitFor, render } from "@testing-library/react";
import { expect } from "vitest";

import { SQUARE_METERS_HTML_SYMBOL } from "@/shared/core/format-number/formatNumber";

import SoilsDecontaminationSurfaceArea from "./SoilsDecontaminationSurfaceArea";

describe("SoilsDecontaminationSurfaceArea", () => {
  const defaultProps = {
    contaminatedSoilSurface: 1000,
    onSubmit: vi.fn(),
    onBack: vi.fn(),
    inputMode: "percentage" as const,
    onInputModeChange: vi.fn(),
  };

  describe("with input mode: percentage", () => {
    it("should render with percentage mode by default", async () => {
      render(<SoilsDecontaminationSurfaceArea {...defaultProps} />);

      const input = await screen.findByRole("textbox", { name: /part à dépolluer/i });
      expect(input).toBeInTheDocument();

      const percentModeButton = screen.getByLabelText("%");
      expect(percentModeButton).toBeChecked();
    });

    it("should display hint text showing contaminated surface area", async () => {
      render(<SoilsDecontaminationSurfaceArea {...defaultProps} />);

      expect(screen.getByText(/Surface contaminée : 1 000 ㎡/)).toBeInTheDocument();
    });

    it("should display equivalent in square meters when value is entered", async () => {
      render(<SoilsDecontaminationSurfaceArea {...defaultProps} />);

      const input = await screen.findByRole("textbox", { name: /part à dépolluer/i });
      fireEvent.input(input, { target: { value: 50 } });

      expect(screen.getByText(/Soit/)).toContainHTML("Soit <strong>500 ㎡</strong>");
    });

    it("should convert percentage to square meters on submit", async () => {
      const onSubmitSpy = vi.fn();
      render(<SoilsDecontaminationSurfaceArea {...defaultProps} onSubmit={onSubmitSpy} />);

      const input = await screen.findByRole("textbox", { name: /part à dépolluer/i });
      const submitButton = await screen.findByRole("button", { name: /valider/i });

      fireEvent.input(input, { target: { value: 50 } });
      fireEvent.submit(submitButton);

      await waitFor(() => {
        // oxlint-disable-next-line no-standalone-expect
        expect(onSubmitSpy).toHaveBeenCalledWith(500);
      });
    });

    it("should keep submit button disabled when value exceeds 100%", async () => {
      render(<SoilsDecontaminationSurfaceArea {...defaultProps} />);

      const input = await screen.findByRole("textbox", { name: /part à dépolluer/i });
      const submitButton = await screen.findByRole("button", { name: /valider/i });

      fireEvent.input(input, { target: { value: 150 } });

      await waitFor(() => {
        // oxlint-disable-next-line no-standalone-expect
        expect(submitButton).toBeDisabled();
      });
    });
  });

  describe("with input mode: square meters", () => {
    it("should render with square meters mode when specified", async () => {
      render(<SoilsDecontaminationSurfaceArea {...defaultProps} inputMode="squareMeters" />);

      const squareMetersModeButton = screen.getByLabelText(SQUARE_METERS_HTML_SYMBOL);
      expect(squareMetersModeButton).toBeChecked();
    });

    it("should display equivalent in percentage when value is entered", async () => {
      render(<SoilsDecontaminationSurfaceArea {...defaultProps} inputMode="squareMeters" />);

      const input = await screen.findByRole("textbox", { name: /part à dépolluer/i });
      fireEvent.input(input, { target: { value: 50 } });

      expect(screen.getByText(/Soit/)).toContainHTML("Soit <strong>5%</strong>");
    });

    it("should submit value directly in square meters mode", async () => {
      const onSubmitSpy = vi.fn();
      render(
        <SoilsDecontaminationSurfaceArea
          {...defaultProps}
          inputMode="squareMeters"
          onSubmit={onSubmitSpy}
        />,
      );

      const input = await screen.findByRole("textbox", { name: /part à dépolluer/i });
      const submitButton = await screen.findByRole("button", { name: /valider/i });

      fireEvent.input(input, { target: { value: 500 } });
      fireEvent.submit(submitButton);
      await waitFor(() => {
        // oxlint-disable-next-line no-standalone-expect
        expect(onSubmitSpy).toHaveBeenCalledWith(500);
      });
    });

    it("should keep submit button disabled when value exceeds contaminated surface area", async () => {
      render(<SoilsDecontaminationSurfaceArea {...defaultProps} inputMode="squareMeters" />);

      const input = await screen.findByRole("textbox", { name: /part à dépolluer/i });
      const submitButton = await screen.findByRole("button", { name: /valider/i });

      fireEvent.input(input, { target: { value: 1500 } });

      await waitFor(() => {
        // oxlint-disable-next-line no-standalone-expect
        expect(submitButton).toBeDisabled();
      });
    });
  });

  describe("mode switching", () => {
    it("should convert value when switching from percentage to square meters", async () => {
      const onInputModeChangeSpy = vi.fn();
      render(
        <SoilsDecontaminationSurfaceArea
          {...defaultProps}
          onInputModeChange={onInputModeChangeSpy}
        />,
      );

      const input = await screen.findByRole("textbox", { name: /part à dépolluer/i });
      const squareMetersModeButton = screen.getByLabelText(SQUARE_METERS_HTML_SYMBOL);

      fireEvent.input(input, { target: { value: 50 } });
      fireEvent.click(squareMetersModeButton);

      expect(input).toHaveDisplayValue("500");
      expect(onInputModeChangeSpy).toHaveBeenCalledWith("squareMeters");
    });

    it("should convert value when switching from square meters to percentage", async () => {
      const onInputModeChangeSpy = vi.fn();
      render(
        <SoilsDecontaminationSurfaceArea
          {...defaultProps}
          inputMode="squareMeters"
          onInputModeChange={onInputModeChangeSpy}
        />,
      );

      const input = await screen.findByRole("textbox", { name: /part à dépolluer/i });
      const percentModeButton = screen.getByLabelText("%");

      fireEvent.input(input, { target: { value: 500 } });
      fireEvent.click(percentModeButton);

      expect(input).toHaveDisplayValue("50");
      expect(onInputModeChangeSpy).toHaveBeenCalledWith("percentage");
    });

    it("should handle empty input when switching modes", async () => {
      render(<SoilsDecontaminationSurfaceArea {...defaultProps} />);

      const input = await screen.findByRole("textbox", { name: /part à dépolluer/i });
      const squareMetersModeButton = screen.getByLabelText(SQUARE_METERS_HTML_SYMBOL);

      // Switch without entering a value
      fireEvent.click(squareMetersModeButton);

      expect(input).toHaveDisplayValue("0");
    });
  });

  describe("initial values", () => {
    it("should respect initial values in percentage mode", async () => {
      render(
        <SoilsDecontaminationSurfaceArea {...defaultProps} initialValues={{ surfaceArea: 75 }} />,
      );

      const input = await screen.findByRole("textbox", { name: /part à dépolluer/i });
      expect(input).toHaveDisplayValue("75");
    });

    it("should respect initial values in square meters mode", async () => {
      render(
        <SoilsDecontaminationSurfaceArea
          {...defaultProps}
          inputMode="squareMeters"
          initialValues={{ surfaceArea: 750 }}
        />,
      );

      const input = await screen.findByRole("textbox", { name: /part à dépolluer/i });
      expect(input).toHaveDisplayValue("750");
    });
  });
});
