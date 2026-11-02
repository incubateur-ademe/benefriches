import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import SiteNameAndDescriptionForm from "./SiteNameAndDescription";

describe("SiteNameAndDescriptionForm", () => {
  it("tells the user the 255-character limit and does not submit when the site name is longer", async () => {
    const onSubmit = vi.fn();
    render(
      <SiteNameAndDescriptionForm
        initialValues={{ name: "Friche industrielle de Blajan" }}
        onSubmit={onSubmit}
        onBack={vi.fn()}
      />,
    );

    await act(async () => {
      fireEvent.change(screen.getByLabelText(/Nom du site/), {
        target: { value: "a".repeat(256) },
      });
    });

    expect(screen.getByText("Le nom ne doit pas dépasser 255 caractères.")).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Valider" }));
    });
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
