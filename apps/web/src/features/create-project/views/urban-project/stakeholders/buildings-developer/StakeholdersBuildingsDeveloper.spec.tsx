import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import StakeholdersBuildingsDeveloper from "./StakeholdersBuildingsDeveloper";

const defaultProps = {
  onSubmit: vi.fn(),
  onBack: vi.fn(),
};

const RESOLD_LABEL = "Oui, les bâtiments seront revendus";
const KEPT_LABEL = "Non, les bâtiments resteront exclusivement la propriété de l'aménageur";

const getNextButton = () => screen.getByRole("button", { name: "Suivant" });
const check = (name: string) => {
  fireEvent.click(screen.getByRole("radio", { name }));
};

describe("StakeholdersBuildingsDeveloper", () => {
  it("disables « Suivant » when nothing is answered", () => {
    render(<StakeholdersBuildingsDeveloper {...defaultProps} />);

    expect(getNextButton()).toBeDisabled();
  });

  it("asks whether the buildings will be resold and disables « Suivant » when the developer builds", async () => {
    render(<StakeholdersBuildingsDeveloper {...defaultProps} />);

    check("Oui");

    expect(
      await screen.findByText(
        "Une fois construits ou réhabilités, les bâtiments seront-ils revendus ?",
      ),
    ).toBeInTheDocument();
    expect(getNextButton()).toBeDisabled();
  });

  it("enables « Suivant » when the developer builds and the buildings resale is answered", async () => {
    render(<StakeholdersBuildingsDeveloper {...defaultProps} />);

    check("Oui");
    await screen.findByRole("radio", { name: RESOLD_LABEL });
    check(RESOLD_LABEL);

    await waitFor(() => {
      expect(getNextButton()).toBeEnabled();
    });
  });

  it("hides the buildings resale question and enables « Suivant » when the developer does not build", async () => {
    render(<StakeholdersBuildingsDeveloper {...defaultProps} />);

    check("Non");

    await waitFor(() => {
      expect(getNextButton()).toBeEnabled();
    });
    expect(screen.queryByRole("radio", { name: KEPT_LABEL })).not.toBeInTheDocument();
  });

  it("disables « Suivant » again when switching back to Oui without a buildings resale answer", async () => {
    render(<StakeholdersBuildingsDeveloper {...defaultProps} />);

    check("Oui");
    check("Non");
    await waitFor(() => {
      expect(getNextButton()).toBeEnabled();
    });
    check("Oui");

    await waitFor(() => {
      expect(getNextButton()).toBeDisabled();
    });
  });
});
