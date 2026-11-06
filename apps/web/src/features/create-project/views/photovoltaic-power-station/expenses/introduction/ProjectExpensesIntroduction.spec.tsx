import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import ProjectExpensesIntroduction from "./ProjectExpensesIntroduction";

describe("ProjectExpensesIntroduction (photovoltaic)", () => {
  it("mentions the friche reinstatement when the project involves reinstatement works", () => {
    render(<ProjectExpensesIntroduction involvesReinstatement onNext={vi.fn()} onBack={vi.fn()} />);

    expect(
      screen.getByText(
        "Notamment pour la remise en état de la friche, l’installation des panneaux photovoltaïques et son exploitation.",
      ),
    ).toBeInTheDocument();
  });

  it("does not mention a friche reinstatement when the project involves no reinstatement works", () => {
    render(
      <ProjectExpensesIntroduction
        involvesReinstatement={false}
        onNext={vi.fn()}
        onBack={vi.fn()}
      />,
    );

    expect(
      screen.getByText(
        "Notamment pour l’installation des panneaux photovoltaïques et son exploitation.",
      ),
    ).toBeInTheDocument();
    expect(screen.queryByText(/remise en état de la friche/)).not.toBeInTheDocument();
  });
});
