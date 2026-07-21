import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import ScheduleProjectionForm from "./ScheduleProjectionForm";

const defaultProps = {
  hasReinstatement: false,
  installationScheduleLabel: "🏗️ Travaux d'installation",
  onSubmit: vi.fn(),
  onBack: vi.fn(),
};

describe("ScheduleProjectionForm", () => {
  describe("firstYearOfOperation validation", () => {
    it("shows error message when user enters a month/year value (e.g. 032029) instead of a year", async () => {
      render(<ScheduleProjectionForm {...defaultProps} />);

      const yearInput = screen.getByRole("textbox", { name: /année de mise en service/i });
      fireEvent.change(yearInput, { target: { value: "032029" } });
      fireEvent.blur(yearInput);

      await waitFor(() => {
        expect(screen.getByText("Veuillez entrer une année valide")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /valider/i })).toBeDisabled();
      });
    });

    it("shows error message when year is below 2000", async () => {
      render(<ScheduleProjectionForm {...defaultProps} />);

      const yearInput = screen.getByRole("textbox", { name: /année de mise en service/i });
      fireEvent.change(yearInput, { target: { value: "1999" } });
      fireEvent.blur(yearInput);

      await waitFor(() => {
        expect(screen.getByText("Veuillez entrer une année valide")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /valider/i })).toBeDisabled();
      });
    });
  });

  describe("installation schedule end date validation", () => {
    it("shows error message when end date is before start date", async () => {
      render(<ScheduleProjectionForm {...defaultProps} />);

      const startDateInputs = screen.getAllByPlaceholderText("MM/AAAA");
      const startDateInput = startDateInputs[0]!;
      const endDateInput = startDateInputs[1]!;

      fireEvent.change(startDateInput, { target: { value: "062025" } });
      fireEvent.change(endDateInput, { target: { value: "032025" } });
      fireEvent.blur(endDateInput);

      await waitFor(() => {
        expect(
          screen.getByText("La date de fin doit être après la date de début"),
        ).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /valider/i })).toBeDisabled();
      });
    });

    it("hides duration when end date is before start date", async () => {
      render(<ScheduleProjectionForm {...defaultProps} />);

      const startDateInputs = screen.getAllByPlaceholderText("MM/AAAA");
      const startDateInput = startDateInputs[0]!;
      const endDateInput = startDateInputs[1]!;

      fireEvent.change(startDateInput, { target: { value: "062025" } });
      fireEvent.change(endDateInput, { target: { value: "032025" } });
      fireEvent.blur(endDateInput);

      await waitFor(() => {
        expect(screen.queryByText(/Soit/)).not.toBeInTheDocument();
      });
    });

    it("shows duration when both dates are valid", async () => {
      render(<ScheduleProjectionForm {...defaultProps} />);

      const startDateInputs = screen.getAllByPlaceholderText("MM/AAAA");
      const startDateInput = startDateInputs[0]!;
      const endDateInput = startDateInputs[1]!;

      fireEvent.change(startDateInput, { target: { value: "012025" } });
      fireEvent.change(endDateInput, { target: { value: "062025" } });

      await waitFor(() => {
        expect(screen.getByText(/Soit/)).toBeInTheDocument();
      });
    });
  });
});
