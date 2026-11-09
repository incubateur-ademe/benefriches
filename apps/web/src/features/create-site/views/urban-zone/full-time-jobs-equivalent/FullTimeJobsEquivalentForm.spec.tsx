import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { expect } from "vitest";

import FullTimeJobsEquivalentForm from "./FullTimeJobsEquivalentForm";

const fillJobsAndSubmit = async (value: string) => {
  const input = await screen.findByRole("textbox", { name: /nombre d'emplois/i });
  fireEvent.input(input, { target: { value } });
  const submitButton = screen.getByRole("button", { name: "Valider" });
  await waitFor(() => {
    expect(submitButton).toBeEnabled();
  });
  fireEvent.click(submitButton);
};

describe("FullTimeJobsEquivalentForm", () => {
  it("submits a decimal number of jobs typed with a comma", async () => {
    const onSubmitSpy = vi.fn();
    render(<FullTimeJobsEquivalentForm onSubmit={onSubmitSpy} onBack={vi.fn()} />);

    await fillJobsAndSubmit("2,5");

    await waitFor(() => {
      expect(onSubmitSpy).toHaveBeenCalledTimes(1);
    });
    expect(onSubmitSpy.mock.calls[0]?.[0]).toEqual({ fullTimeJobs: 2.5 });
  });

  it("submits a decimal number of jobs typed with a dot", async () => {
    const onSubmitSpy = vi.fn();
    render(<FullTimeJobsEquivalentForm onSubmit={onSubmitSpy} onBack={vi.fn()} />);

    await fillJobsAndSubmit("2.5");

    await waitFor(() => {
      expect(onSubmitSpy).toHaveBeenCalledTimes(1);
    });
    expect(onSubmitSpy.mock.calls[0]?.[0]).toEqual({ fullTimeJobs: 2.5 });
  });

  it("submits the saved decimal value when the user comes back to the step", async () => {
    const onSubmitSpy = vi.fn();
    render(
      <FullTimeJobsEquivalentForm initialValue={2.5} onSubmit={onSubmitSpy} onBack={vi.fn()} />,
    );

    expect(await screen.findByRole("textbox", { name: /nombre d'emplois/i })).toHaveValue("2.5");
    const submitButton = screen.getByRole("button", { name: "Valider" });
    await waitFor(() => {
      expect(submitButton).toBeEnabled();
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(onSubmitSpy).toHaveBeenCalledTimes(1);
    });
    expect(onSubmitSpy.mock.calls[0]?.[0]).toEqual({ fullTimeJobs: 2.5 });
  });

  it("blocks submission and tells the user when the value is not a number", async () => {
    const onSubmitSpy = vi.fn();
    render(<FullTimeJobsEquivalentForm onSubmit={onSubmitSpy} onBack={vi.fn()} />);

    const input = await screen.findByRole("textbox", { name: /nombre d'emplois/i });
    fireEvent.input(input, { target: { value: "abc" } });

    expect(
      await screen.findByText("Ce champ est nécessaire pour déterminer les questions suivantes"),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Valider" })).toBeDisabled();
    expect(onSubmitSpy).not.toHaveBeenCalled();
  });

  it("blocks submission with the shared message when the value is negative", async () => {
    const onSubmitSpy = vi.fn();
    render(<FullTimeJobsEquivalentForm onSubmit={onSubmitSpy} onBack={vi.fn()} />);

    const input = await screen.findByRole("textbox", { name: /nombre d'emplois/i });
    fireEvent.input(input, { target: { value: "-2,5" } });

    expect(await screen.findByText("Veuillez entrer un nombre valide")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Valider" })).toBeDisabled();
  });
});
