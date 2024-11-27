import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { expect } from "vitest";

import SurfaceAreaDistributionForm from "./SurfaceAreaDistributionForm";

describe("SurfaceAreaDistributionForm", () => {
  it("should not call onSubmit if form is invalid", async () => {
    const onSubmitSpy = vi.fn();

    render(
      <SurfaceAreaDistributionForm
        title="Test form"
        surfaces={[
          { name: "field1", label: "Field1" },
          { name: "field2", label: "Field2" },
        ]}
        totalSurfaceArea={10000}
        onBack={() => {}}
        onSubmit={onSubmitSpy}
      />,
    );

    fireEvent.submit(screen.getByRole("button", { name: "Valider" }));

    expect(screen.getByRole("button", { name: "Valider" })).toBeDisabled();
    await waitFor(() => {
      expect(onSubmitSpy).not.toHaveBeenCalled();
    });
  });

  it("should call onSubmit with right args if form is valid and convert percent values to square meters", async () => {
    const onSubmitSpy = vi.fn();

    render(
      <SurfaceAreaDistributionForm
        title="Test form"
        surfaces={[
          { name: "field1", label: "Field1" },
          { name: "field2", label: "Field2" },
        ]}
        totalSurfaceArea={10000}
        onBack={() => {}}
        onSubmit={onSubmitSpy}
      />,
    );
    const submitButton = await screen.findByRole("button", { name: /valider/i });
    const field1 = await screen.findByRole("spinbutton", { name: /field1/i });
    const field2 = await screen.findByRole("spinbutton", { name: /field2/i });

    fireEvent.input(field1, {
      target: {
        value: 70,
      },
    });

    fireEvent.input(field2, {
      target: {
        value: 30,
      },
    });

    expect(field1).toBeInTheDocument();
    expect(field2).toBeInTheDocument();

    expect(field1).toHaveValue(70);
    expect(field2).toHaveValue(30);

    expect(screen.getByRole("button", { name: "Valider" })).not.toBeDisabled();

    fireEvent.submit(submitButton);

    await waitFor(() => {
      expect(onSubmitSpy).toHaveBeenCalledWith({ field1: 7000, field2: 3000 });
    });
  });

  it("should call onSubmit only with surfaces with valid value (nor 0 nor null) and convert percent values to square meters", async () => {
    const onSubmitSpy = vi.fn();

    render(
      <SurfaceAreaDistributionForm
        title="Test form"
        surfaces={[
          { name: "field1", label: "Field1" },
          { name: "field2", label: "Field2" },
          { name: "field3", label: "Field3" },
          { name: "field4", label: "Field4" },
        ]}
        totalSurfaceArea={10000}
        onBack={() => {}}
        onSubmit={onSubmitSpy}
      />,
    );
    const submitButton = await screen.findByRole("button", { name: /valider/i });
    const field1 = await screen.findByRole("spinbutton", { name: /field1/i });
    const field2 = await screen.findByRole("spinbutton", { name: /field2/i });
    const field3 = await screen.findByRole("spinbutton", { name: /field3/i });
    const field4 = await screen.findByRole("spinbutton", { name: /field4/i });

    fireEvent.input(field1, {
      target: {
        value: 70,
      },
    });

    fireEvent.input(field2, {
      target: {
        value: undefined,
      },
    });

    fireEvent.input(field3, {
      target: {
        value: 0,
      },
    });

    fireEvent.input(field4, {
      target: {
        value: 30,
      },
    });

    expect(field1).toBeInTheDocument();
    expect(field2).toBeInTheDocument();
    expect(field3).toBeInTheDocument();
    expect(field4).toBeInTheDocument();

    expect(field1).toHaveValue(70);
    expect(field2).toHaveValue(null);
    expect(field3).toHaveValue(0);
    expect(field4).toHaveValue(30);

    expect(screen.getByRole("button", { name: "Valider" })).not.toBeDisabled();

    fireEvent.submit(submitButton);

    await waitFor(() => {
      expect(onSubmitSpy).toHaveBeenCalledWith({ field1: 7000, field4: 3000 });
    });
  });
});
