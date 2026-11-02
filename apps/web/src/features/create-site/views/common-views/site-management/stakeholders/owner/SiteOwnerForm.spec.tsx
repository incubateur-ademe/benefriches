import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import SiteOwnerForm from "./SiteOwnerForm";

const renderOwnerFormForACompany = (onSubmit = vi.fn()) =>
  render(
    <SiteOwnerForm
      onSubmit={onSubmit}
      onBack={vi.fn()}
      initialValues={{ ownerType: "other_company", ownerName: "", localAuthority: undefined }}
      localAuthoritiesList={[]}
      siteNature="FRICHE"
    />,
  );

describe("SiteOwnerForm", () => {
  it("tells the user the 255-character limit and does not submit when the owner name is longer", async () => {
    const onSubmit = vi.fn();
    renderOwnerFormForACompany(onSubmit);

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

  it("submits an owner name of exactly 255 characters", async () => {
    const onSubmit = vi.fn();
    renderOwnerFormForACompany(onSubmit);
    const ownerName = "a".repeat(255);

    await act(async () => {
      fireEvent.change(screen.getByLabelText(/Nom de l'entreprise/), {
        target: { value: ownerName },
      });
    });
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Valider" }));
    });

    expect(onSubmit.mock.calls[0]?.[0]).toEqual({ ownerType: "other_company", ownerName });
  });
});
