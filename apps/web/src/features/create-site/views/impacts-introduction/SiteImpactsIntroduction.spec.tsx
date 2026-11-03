import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import SiteImpactsIntroduction from "./SiteImpactsIntroduction";

const getAnalysedItems = () =>
  within(
    screen.getByRole("list", { name: /Voilà ce que Bénéfriches va analyser pour vous/ }),
  ).getAllByRole("listitem");

const AVOIDED_COSTS_TEXT = "Les coûts évités grâce à la reconversion de la friche";

describe("SiteImpactsIntroduction", () => {
  it("lists the three analysed items, avoided costs included, for a friche", () => {
    render(<SiteImpactsIntroduction showsAvoidedCosts onNext={vi.fn()} onBack={vi.fn()} />);

    expect(getAnalysedItems()).toHaveLength(3);
    expect(screen.getByText(AVOIDED_COSTS_TEXT)).toBeInTheDocument();
  });

  it("hides the avoided costs item for a site that is not a friche", () => {
    render(<SiteImpactsIntroduction showsAvoidedCosts={false} onNext={vi.fn()} onBack={vi.fn()} />);

    expect(getAnalysedItems()).toHaveLength(2);
    expect(screen.queryByText(AVOIDED_COSTS_TEXT)).not.toBeInTheDocument();
  });

  it("calls onNext when Suivant is clicked", () => {
    const onNext = vi.fn();
    render(<SiteImpactsIntroduction showsAvoidedCosts onNext={onNext} onBack={vi.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: "Suivant" }));

    expect(onNext).toHaveBeenCalledOnce();
  });

  it("calls onBack when Précédent is clicked", () => {
    const onBack = vi.fn();
    render(<SiteImpactsIntroduction showsAvoidedCosts onNext={vi.fn()} onBack={onBack} />);

    fireEvent.click(screen.getByRole("button", { name: "Précédent" }));

    expect(onBack).toHaveBeenCalledOnce();
  });
});
