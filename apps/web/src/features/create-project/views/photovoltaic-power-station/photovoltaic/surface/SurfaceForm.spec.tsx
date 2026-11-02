import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import PhotovoltaicSurfaceForm from "./SurfaceForm";

describe("PhotovoltaicSurfaceForm", () => {
  it("does not call the surface pre-filled, since the user types it in", () => {
    render(<PhotovoltaicSurfaceForm siteSurfaceArea={10000} onSubmit={vi.fn()} onBack={vi.fn()} />);

    expect(screen.getByRole("textbox", { name: /superficie de l'installation/i })).toHaveValue("");
    expect(screen.queryByText(/pré-remplie/i)).not.toBeInTheDocument();
    expect(screen.getByText("Quel est le ratio superficie / puissance ?")).toBeInTheDocument();
  });
});
