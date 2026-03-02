import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import MonthYearInput from "./MonthYearInput";

function renderInput(value = "", onChange = vi.fn()) {
  const result = render(<MonthYearInput label="Date" value={value} onChange={onChange} />);
  const input = screen.getByPlaceholderText("MM/AAAA");
  return { input, onChange, ...result };
}

describe("MonthYearInput", () => {
  it("renders with placeholder MM/AAAA", () => {
    renderInput();
    expect(screen.getByPlaceholderText("MM/AAAA")).toBeDefined();
  });

  it("displays initial value from storage format", () => {
    renderInput("2027-01-01");
    expect(screen.getByPlaceholderText("MM/AAAA")).toHaveValue("01/2027");
  });

  it("calls onChange with storage format for complete date", () => {
    const { input, onChange } = renderInput("");
    fireEvent.change(input, { target: { value: "012027" } });
    expect(onChange).toHaveBeenCalledWith("2027-01-01");
  });

  it("calls onChange with empty string for partial input", () => {
    const { input, onChange } = renderInput("");
    fireEvent.change(input, { target: { value: "01" } });
    expect(onChange).toHaveBeenCalledWith("");
  });

  it("auto-prepends '0' for month digits 2-9", () => {
    const { input } = renderInput("");
    fireEvent.change(input, { target: { value: "3" } });
    expect(input).toHaveValue("03/");
  });

  it("allows '0' as first digit without auto-prepending", () => {
    const { input } = renderInput("");
    fireEvent.change(input, { target: { value: "0" } });
    expect(input).toHaveValue("0");
  });

  it("allows '1' as first digit without auto-prepending", () => {
    const { input } = renderInput("");
    fireEvent.change(input, { target: { value: "1" } });
    expect(input).toHaveValue("1");
  });

  it("auto-inserts '/' after valid two-digit month", () => {
    const { input } = renderInput("");
    fireEvent.change(input, { target: { value: "01" } });
    expect(input).toHaveValue("01/");
  });

  it("accepts month 12 (upper boundary)", () => {
    const { input } = renderInput("");
    fireEvent.change(input, { target: { value: "12" } });
    expect(input).toHaveValue("12/");
  });

  it("rejects month 13", () => {
    const { input } = renderInput("");
    fireEvent.change(input, { target: { value: "1" } });
    fireEvent.change(input, { target: { value: "13" } });
    expect(input).toHaveValue("1");
  });

  it("rejects month 00", () => {
    const { input } = renderInput("");
    fireEvent.change(input, { target: { value: "0" } });
    fireEvent.change(input, { target: { value: "00" } });
    expect(input).toHaveValue("0");
  });

  it("strips non-digit characters", () => {
    const { input, onChange } = renderInput("");
    fireEvent.change(input, { target: { value: "ab03cd2027" } });
    expect(input).toHaveValue("03/2027");
    expect(onChange).toHaveBeenCalledWith("2027-03-01");
  });

  it("truncates year to 4 digits", () => {
    const { input, onChange } = renderInput("");
    fireEvent.change(input, { target: { value: "01202799" } });
    expect(input).toHaveValue("01/2027");
    expect(onChange).toHaveBeenCalledWith("2027-01-01");
  });

  it("handles backspace over '/' separator", () => {
    const { input } = renderInput("");
    // Type to reach display "01/2"
    fireEvent.change(input, { target: { value: "012" } });
    expect(input).toHaveValue("01/2");
    // Backspace deletes "2" → browser sends "01/"
    fireEvent.change(input, { target: { value: "01/" } });
    expect(input).toHaveValue("01");
  });

  it("handles backspace from '/' when no year digit typed yet", () => {
    const { input } = renderInput("");
    // Type "01" → display auto-appends "/" → "01/"
    fireEvent.change(input, { target: { value: "01" } });
    expect(input).toHaveValue("01/");
    // Backspace deletes "/" → browser sends "01"
    fireEvent.change(input, { target: { value: "01" } });
    expect(input).toHaveValue("01");
  });

  it("clears to empty on full delete", () => {
    const { input, onChange } = renderInput("2027-01-01");
    fireEvent.change(input, { target: { value: "" } });
    expect(onChange).toHaveBeenCalledWith("");
    expect(input).toHaveValue("");
  });
});
