import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import ProjectYearlyRevenuesForm from "./ProjectYearlyRevenueForm";

describe("ProjectYearlyRevenuesForm", () => {
  it("labels the total as a yearly amount, like each revenue", () => {
    render(
      <ProjectYearlyRevenuesForm
        title="Recettes annuelles"
        fields={["operations", "rent"] as const}
        getFieldLabel={(field) => (field === "operations" ? "Exploitation" : "Loyer")}
        initialValues={{ operations: 1000, rent: 500 }}
        onSubmit={vi.fn()}
        onBack={vi.fn()}
      />,
    );

    // 2 revenue fields + the total
    expect(screen.getAllByText("€ / an")).toHaveLength(3);
    expect(screen.queryByText("€")).not.toBeInTheDocument();
  });
});
