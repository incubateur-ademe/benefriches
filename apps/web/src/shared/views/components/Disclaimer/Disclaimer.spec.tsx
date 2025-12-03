import { fireEvent, render, screen } from "@testing-library/react";
import { expect, vi } from "vitest";

import Disclaimer from "./Disclaimer";

describe("Disclaimer", () => {
  it("renders title and children", () => {
    const props = {
      title: "Test Title",
      children: "Test content",
      onDismiss: vi.fn(),
    };
    render(<Disclaimer {...props} />);

    expect(screen.getByRole("heading")).toHaveTextContent("Test Title");
    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  it("disables dismiss button initially", () => {
    const props = {
      title: "Test Title",
      children: "Test content",
      onDismiss: vi.fn(),
    };
    render(<Disclaimer {...props} />);

    const button = screen.getByRole("button", { name: "Masquer ce message" });
    expect(button).toBeDisabled();
  });

  it("enables dismiss button when checkbox is checked", () => {
    const props = {
      title: "Test Title",
      children: "Test content",
      onDismiss: vi.fn(),
    };
    render(<Disclaimer {...props} />);

    const checkbox = screen.getByLabelText("J'ai compris");
    fireEvent.click(checkbox);

    const button = screen.getByRole("button", { name: "Masquer ce message" });
    expect(button).not.toBeDisabled();

    fireEvent.click(button);
    expect(props.onDismiss).toHaveBeenCalled();
  });
});
