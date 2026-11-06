import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import SiteOperatorForm from "./SiteOperatorForm";

describe("SiteOperatorForm", () => {
  it("tells the user the 255-character limit and does not submit when the operator name is longer", async () => {
    const onSubmit = vi.fn();
    render(
      <SiteOperatorForm
        onSubmit={onSubmit}
        onBack={vi.fn()}
        currentOwnerStructureName="Mairie de Blajan"
        localAuthoritiesList={[]}
      />,
    );

    await act(async () => {
      fireEvent.click(screen.getByLabelText("Une entreprise"));
    });
    await act(async () => {
      fireEvent.change(screen.getByLabelText(/Nom de l'entreprise/), {
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
