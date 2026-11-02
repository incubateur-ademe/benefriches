import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import YearlyProjectedExpensesForm from "./YearlyProjectedExpensesForm";

describe("YearlyProjectedExpensesForm", () => {
  it("labels the total as a yearly amount, like each expense", () => {
    render(
      <YearlyProjectedExpensesForm
        initialValues={{ rentAmount: 1000, maintenanceAmount: 500 }}
        onSubmit={vi.fn()}
        onBack={vi.fn()}
      />,
    );

    // 4 expense fields + the total
    expect(screen.getAllByText("€ / an")).toHaveLength(5);
    expect(screen.queryByText("€")).not.toBeInTheDocument();
  });
});
