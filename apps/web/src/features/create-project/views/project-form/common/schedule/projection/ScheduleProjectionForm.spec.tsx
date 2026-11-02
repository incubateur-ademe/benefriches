import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import ScheduleProjectionForm from "./ScheduleProjectionForm";

function getScheduleInputs() {
  return {
    startDateInput: screen.getByRole("textbox", { name: "Début des travaux" }),
    endDateInput: screen.getByRole("textbox", { name: "Fin des travaux" }),
    yearInput: screen.getByRole("textbox", { name: /année de mise en service/i }),
  };
}

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
  describe("first year of operation consistency with works end date", () => {
    it("shows an error and disables Valider when the year is before the end of works", async () => {
      render(<ScheduleProjectionForm {...defaultProps} onSubmit={vi.fn()} />);
      const { startDateInput, endDateInput, yearInput } = getScheduleInputs();

      fireEvent.change(startDateInput, { target: { value: "062030" } });
      fireEvent.change(endDateInput, { target: { value: "122030" } });
      fireEvent.change(yearInput, { target: { value: "2027" } });
      fireEvent.blur(yearInput);

      await waitFor(() => {
        expect(
          screen.getByText(
            "L'année de mise en service ne peut pas être antérieure à la fin des travaux (2030)",
          ),
        ).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /valider/i })).toBeDisabled();
      });
    });

    it("submits when the year is the year the works end", async () => {
      const onSubmit = vi.fn();
      render(<ScheduleProjectionForm {...defaultProps} onSubmit={onSubmit} />);
      const { startDateInput, endDateInput, yearInput } = getScheduleInputs();

      fireEvent.change(startDateInput, { target: { value: "062030" } });
      fireEvent.change(endDateInput, { target: { value: "122030" } });
      fireEvent.change(yearInput, { target: { value: "2030" } });
      fireEvent.blur(yearInput);
      await waitFor(() => {
        expect(screen.getByRole("button", { name: /valider/i })).toBeEnabled();
      });
      fireEvent.click(screen.getByRole("button", { name: /valider/i }));

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith({
          firstYearOfOperation: 2030,
          installationSchedule: { startDate: "2030-06-01", endDate: "2030-12-01" },
          reinstatementSchedule: undefined,
        });
      });
    });

    it("shows the error when the end of works is moved after an already entered year", async () => {
      render(<ScheduleProjectionForm {...defaultProps} onSubmit={vi.fn()} />);
      const { startDateInput, endDateInput, yearInput } = getScheduleInputs();

      fireEvent.change(startDateInput, { target: { value: "062026" } });
      fireEvent.change(endDateInput, { target: { value: "122026" } });
      fireEvent.change(yearInput, { target: { value: "2027" } });
      fireEvent.blur(yearInput);
      await waitFor(() => {
        expect(screen.getByRole("button", { name: /valider/i })).toBeEnabled();
      });
      fireEvent.change(endDateInput, { target: { value: "122030" } });

      await waitFor(() => {
        expect(
          screen.getByText(
            "L'année de mise en service ne peut pas être antérieure à la fin des travaux (2030)",
          ),
        ).toBeInTheDocument();
      });
    });

    it("shows an error when the year is before the end of the site reinstatement", async () => {
      render(<ScheduleProjectionForm {...defaultProps} hasReinstatement onSubmit={vi.fn()} />);
      const [reinstatementStart, reinstatementEnd, installationStart, installationEnd] =
        screen.getAllByPlaceholderText("MM/AAAA");

      fireEvent.change(reinstatementStart!, { target: { value: "012026" } });
      fireEvent.change(reinstatementEnd!, { target: { value: "122028" } });
      fireEvent.change(installationStart!, { target: { value: "012026" } });
      fireEvent.change(installationEnd!, { target: { value: "062026" } });
      const yearInput = screen.getByRole("textbox", { name: /année de mise en service/i });
      fireEvent.change(yearInput, { target: { value: "2027" } });
      fireEvent.blur(yearInput);

      await waitFor(() => {
        expect(
          screen.getByText(
            "L'année de mise en service ne peut pas être antérieure à la fin des travaux (2028)",
          ),
        ).toBeInTheDocument();
      });
    });
  });

  describe("works dates feedback while typing", () => {
    it("shows the end-before-start error as soon as the end date is typed, without the duration", async () => {
      render(<ScheduleProjectionForm {...defaultProps} />);
      const { startDateInput, endDateInput } = getScheduleInputs();

      fireEvent.change(startDateInput, { target: { value: "062030" } });
      fireEvent.change(endDateInput, { target: { value: "011990" } });

      await waitFor(() => {
        expect(
          screen.getByText("La date de fin doit être après la date de début"),
        ).toBeInTheDocument();
      });
      expect(screen.queryByText(/Soit/)).not.toBeInTheDocument();
    });

    it("removes the end-before-start error as soon as the end date is corrected", async () => {
      render(<ScheduleProjectionForm {...defaultProps} />);
      const { startDateInput, endDateInput } = getScheduleInputs();

      fireEvent.change(startDateInput, { target: { value: "062030" } });
      fireEvent.change(endDateInput, { target: { value: "011990" } });
      await waitFor(() => {
        expect(
          screen.getByText("La date de fin doit être après la date de début"),
        ).toBeInTheDocument();
      });
      fireEvent.change(endDateInput, { target: { value: "122030" } });

      await waitFor(() => {
        expect(
          screen.queryByText("La date de fin doit être après la date de début"),
        ).not.toBeInTheDocument();
        expect(screen.getByText(/Soit/)).toBeInTheDocument();
      });
    });

    it("keeps the end date when the start date is changed", () => {
      render(<ScheduleProjectionForm {...defaultProps} />);
      const { startDateInput, endDateInput } = getScheduleInputs();

      fireEvent.change(startDateInput, { target: { value: "062030" } });
      fireEvent.change(endDateInput, { target: { value: "122030" } });
      fireEvent.change(startDateInput, { target: { value: "13/2026" } });

      expect(endDateInput).toHaveValue("12/2030");
    });
  });
});
