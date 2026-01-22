import { screen, fireEvent, waitFor, render } from "@testing-library/react";
import { expect } from "vitest";

import { SQUARE_METERS_HTML_SYMBOL } from "@/shared/core/format-number/formatNumber";

import SurfaceAreaDistributionForm from "./SurfaceAreaDistributionForm";

describe("SurfaceAreaDistributionForm", () => {
  describe("with input mode: square meters", () => {
    it("should not submit and display remaining surface to allocate when no surface area has been entered", async () => {
      const onSubmitSpy = vi.fn();

      render(
        <SurfaceAreaDistributionForm
          title="Test form"
          surfaces={[
            { name: "field1", label: "Field1" },
            { name: "field2", label: "Field2" },
          ]}
          inputMode="squareMeters"
          onInputModeChange={vi.fn()}
          totalSurfaceArea={50}
          onBack={() => {}}
          onSubmit={onSubmitSpy}
        />,
      );
      const controlInput = await screen.findByText("Total de toutes les surfaces");

      expect(controlInput).toHaveTextContent("50 ㎡ manquants");
      fireEvent.submit(screen.getByRole("button", { name: "Valider" }));

      expect(screen.getByRole("button", { name: "Valider" })).toBeDisabled();
      await waitFor(() => {
        // oxlint-disable-next-line no-standalone-expect
        expect(onSubmitSpy).not.toHaveBeenCalled();
      });
    });

    it("should be able to submit when form is valid", async () => {
      const onSubmitSpy = vi.fn();

      render(
        <SurfaceAreaDistributionForm
          title="Test form"
          surfaces={[
            { name: "field1", label: "Field1" },
            { name: "field2", label: "Field2" },
            { name: "field3", label: "Field3" },
          ]}
          inputMode="squareMeters"
          onInputModeChange={vi.fn()}
          totalSurfaceArea={50}
          onBack={() => {}}
          onSubmit={onSubmitSpy}
        />,
      );
      const input1 = await screen.findByRole("textbox", { name: /field1/i });
      const input2 = await screen.findByRole("textbox", { name: /field2/i });
      const controlInput = await screen.findByText("Total de toutes les surfaces");
      const submitButton = await screen.findByRole("button", { name: /valider/i });

      expect(controlInput).toHaveTextContent("50 ㎡ manquants");
      fireEvent.input(input1, { target: { value: 30 } });
      fireEvent.input(input2, { target: { value: 20 } });
      expect(controlInput).toHaveTextContent("Le compte est bon");
      expect(screen.getByRole("button", { name: "Valider" })).not.toBeDisabled();

      fireEvent.submit(submitButton);

      await waitFor(() => {
        // oxlint-disable-next-line no-standalone-expect
        expect(onSubmitSpy).toHaveBeenCalledWith({ field1: 30, field2: 20 });
      });
    });

    it("should display a pie chart with non-zero surface areas displayed and a 'Non assigné' slice", async () => {
      render(
        <SurfaceAreaDistributionForm
          title="Test form"
          surfaces={[
            { name: "field1", label: "Area 1" },
            { name: "field2", label: "Area 2" },
            { name: "field3", label: "Area 3" },
          ]}
          inputMode="squareMeters"
          onInputModeChange={vi.fn()}
          totalSurfaceArea={50}
          onBack={() => {}}
          onSubmit={() => {}}
        />,
      );

      const input1 = await screen.findByRole("textbox", { name: /Area 1/i });
      const input2 = await screen.findByRole("textbox", { name: /Area 2/i });

      // enter surface areas in square meters
      fireEvent.input(input1, { target: { value: 30 } });
      fireEvent.input(input2, { target: { value: 15 } });

      expect(screen.getAllByRole("img")).toHaveLength(3);
      expect(screen.getByRole("img", { name: /Area 1, 30/ })).toBeVisible();
      expect(screen.getByRole("img", { name: /Area 2, 15/ })).toBeVisible();
      expect(screen.getByRole("img", { name: /Non assigné, 5/ })).toBeVisible();
    });

    it("should let user switch to percentage mode", async () => {
      const onInputModeChangeSpy = vi.fn();
      render(
        <SurfaceAreaDistributionForm
          title="Test form"
          surfaces={[
            { name: "field1", label: "Field1" },
            { name: "field2", label: "Field2" },
          ]}
          inputMode="squareMeters"
          onInputModeChange={onInputModeChangeSpy}
          totalSurfaceArea={50}
          onBack={() => {}}
          onSubmit={() => {}}
        />,
      );
      const input1 = await screen.findByRole("textbox", { name: /field1/i });
      const input2 = await screen.findByRole("textbox", { name: /field2/i });
      const percentageModeButton = await screen.findByLabelText("%");

      // enter surface areas in square meters
      fireEvent.input(input1, { target: { value: 35 } });
      fireEvent.input(input2, { target: { value: 15 } });

      // switch from square meters to percentage
      fireEvent.click(percentageModeButton);
      expect(input1).toHaveDisplayValue("70");
      expect(input2).toHaveDisplayValue("30");
      // verify onInputModeChange callback called with "percentage"
      expect(onInputModeChangeSpy).toHaveBeenCalledWith("percentage");
    });
  });

  describe("with input mode: percentage", () => {
    it("should not submit and display remaining surface to allocate when no surface area has been entered", async () => {
      const onSubmitSpy = vi.fn();

      render(
        <SurfaceAreaDistributionForm
          title="Test form"
          surfaces={[
            { name: "field1", label: "Field1" },
            { name: "field2", label: "Field2" },
          ]}
          inputMode="percentage"
          onInputModeChange={vi.fn()}
          totalSurfaceArea={10000}
          onBack={() => {}}
          onSubmit={onSubmitSpy}
        />,
      );
      const controlInput = await screen.findByText("Total de toutes les surfaces");

      expect(controlInput).toHaveTextContent("100% manquants");
      fireEvent.submit(screen.getByRole("button", { name: "Valider" }));

      expect(screen.getByRole("button", { name: "Valider" })).toBeDisabled();
      await waitFor(() => {
        // oxlint-disable-next-line no-standalone-expect
        expect(onSubmitSpy).not.toHaveBeenCalled();
      });
    });

    it("should be able to submit when form is valid and convert percent values to square meters", async () => {
      const onSubmitSpy = vi.fn();

      render(
        <SurfaceAreaDistributionForm
          title="Test form"
          surfaces={[
            { name: "field1", label: "Field1" },
            { name: "field2", label: "Field2" },
            { name: "field3", label: "Field3" },
          ]}
          inputMode="percentage"
          onInputModeChange={vi.fn()}
          totalSurfaceArea={10000}
          onBack={() => {}}
          onSubmit={onSubmitSpy}
        />,
      );
      const submitButton = await screen.findByRole("button", { name: /valider/i });
      const input1 = await screen.findByRole("textbox", { name: /field1/i });
      const input2 = await screen.findByRole("textbox", { name: /field2/i });
      const controlInput = await screen.findByText("Total de toutes les surfaces");

      expect(controlInput).toHaveTextContent("100% manquants");
      fireEvent.input(input1, { target: { value: 70 } });
      fireEvent.input(input2, { target: { value: 30 } });

      expect(input1).toHaveDisplayValue("70");
      expect(input2).toHaveDisplayValue("30");
      expect(controlInput).toHaveTextContent("Le compte est bon");
      expect(screen.getByRole("button", { name: "Valider" })).not.toBeDisabled();

      fireEvent.submit(submitButton);

      await waitFor(() => {
        // oxlint-disable-next-line no-standalone-expect
        expect(onSubmitSpy).toHaveBeenCalledWith({ field1: 7000, field2: 3000 });
      });
    });

    it("should only submit surface areas with positive values and convert percent values to square meters", async () => {
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
          inputMode="percentage"
          onInputModeChange={vi.fn()}
          totalSurfaceArea={10000}
          onBack={() => {}}
          onSubmit={onSubmitSpy}
        />,
      );
      const submitButton = await screen.findByRole("button", { name: /valider/i });
      const input1 = await screen.findByRole("textbox", { name: /field1/i });
      const input2 = await screen.findByRole("textbox", { name: /field2/i });
      const input3 = await screen.findByRole("textbox", { name: /field3/i });
      const input4 = await screen.findByRole("textbox", { name: /field4/i });

      fireEvent.input(input1, { target: { value: 70 } });
      fireEvent.input(input2, { target: { value: undefined } });
      fireEvent.input(input3, { target: { value: 0 } });
      fireEvent.input(input4, { target: { value: 30 } });

      expect(input1).toHaveDisplayValue("70");
      expect(input2).toHaveDisplayValue("");
      expect(input3).toHaveDisplayValue("0");
      expect(input4).toHaveDisplayValue("30");

      expect(screen.getByRole("button", { name: "Valider" })).not.toBeDisabled();

      fireEvent.submit(submitButton);

      await waitFor(() => {
        // oxlint-disable-next-line no-standalone-expect
        expect(onSubmitSpy).toHaveBeenCalledWith({ field1: 7000, field4: 3000 });
      });
    });

    it("should display a pie chart with non-zero surface areas displayed and a 'Non assigné' slice", async () => {
      render(
        <SurfaceAreaDistributionForm
          title="Test form"
          surfaces={[
            { name: "field1", label: "Area 1" },
            { name: "field2", label: "Area 2" },
          ]}
          inputMode="percentage"
          onInputModeChange={vi.fn()}
          totalSurfaceArea={50}
          onBack={() => {}}
          onSubmit={() => {}}
        />,
      );

      const input1 = await screen.findByRole("textbox", { name: /Area 1/i });

      // enter surface areas in percentage
      fireEvent.input(input1, { target: { value: 50 } });

      expect(screen.getAllByRole("img")).toHaveLength(2);
      expect(screen.getByRole("img", { name: /Area 1, 25/ })).toBeVisible();
      expect(screen.getByRole("img", { name: /Non assigné, 25/ })).toBeVisible();
    });

    it("should let user switch to square meters mode", async () => {
      const onInputModeChangeSpy = vi.fn();
      render(
        <SurfaceAreaDistributionForm
          title="Test form"
          surfaces={[
            { name: "field1", label: "Field1" },
            { name: "field2", label: "Field2" },
          ]}
          inputMode="percentage"
          onInputModeChange={onInputModeChangeSpy}
          totalSurfaceArea={50}
          onBack={() => {}}
          onSubmit={() => {}}
        />,
      );
      const input1 = await screen.findByRole("textbox", { name: /field1/i });
      const input2 = await screen.findByRole("textbox", { name: /field2/i });
      const squareMetersButton = await screen.findByLabelText(SQUARE_METERS_HTML_SYMBOL);

      // enter surface areas in percentage
      fireEvent.input(input1, { target: { value: 30 } });
      fireEvent.input(input2, { target: { value: 70 } });

      // switch from percentage to square meters
      fireEvent.click(squareMetersButton);
      expect(input1).toHaveDisplayValue("15");
      expect(input2).toHaveDisplayValue("35");

      // verify onInputModeChange callback called with "squareMeters"
      expect(onInputModeChangeSpy).toHaveBeenCalledWith("squareMeters");
    });
  });

  describe("with maxSurfaceArea constraint", () => {
    it("should not submit when surface exceeds its maxSurfaceArea in square meters mode", async () => {
      const onSubmitSpy = vi.fn();

      render(
        <SurfaceAreaDistributionForm
          title="Test form"
          surfaces={[
            { name: "field1", label: "Field1", maxSurfaceArea: 20 },
            { name: "field2", label: "Field2" },
          ]}
          inputMode="squareMeters"
          onInputModeChange={vi.fn()}
          totalSurfaceArea={100}
          maxErrorMessage="Surface too large"
          onBack={() => {}}
          onSubmit={onSubmitSpy}
        />,
      );

      const input1 = await screen.findByRole("textbox", { name: /field1/i });
      const input2 = await screen.findByRole("textbox", { name: /field2/i });
      const submitButton = await screen.findByRole("button", { name: /valider/i });

      // Enter 30 in field1, which exceeds its max of 20
      fireEvent.input(input1, { target: { value: 30 } });
      fireEvent.input(input2, { target: { value: 70 } });
      fireEvent.submit(submitButton);

      await waitFor(() => {
        // oxlint-disable-next-line no-standalone-expect
        expect(screen.getByText("Surface too large")).toBeInTheDocument();
      });
      expect(onSubmitSpy).not.toHaveBeenCalled();
    });

    it("should submit when surface is within its maxSurfaceArea in square meters mode", async () => {
      const onSubmitSpy = vi.fn();

      render(
        <SurfaceAreaDistributionForm
          title="Test form"
          surfaces={[
            { name: "field1", label: "Field1", maxSurfaceArea: 20 },
            { name: "field2", label: "Field2" },
          ]}
          inputMode="squareMeters"
          onInputModeChange={vi.fn()}
          totalSurfaceArea={100}
          maxErrorMessage="Surface too large"
          onBack={() => {}}
          onSubmit={onSubmitSpy}
        />,
      );

      const input1 = await screen.findByRole("textbox", { name: /field1/i });
      const input2 = await screen.findByRole("textbox", { name: /field2/i });
      const submitButton = await screen.findByRole("button", { name: /valider/i });

      // Enter 20 in field1, which is within its max of 20
      fireEvent.input(input1, { target: { value: 20 } });
      fireEvent.input(input2, { target: { value: 80 } });
      fireEvent.submit(submitButton);

      await waitFor(() => {
        // oxlint-disable-next-line no-standalone-expect
        expect(onSubmitSpy).toHaveBeenCalledWith({ field1: 20, field2: 80 });
      });
    });

    it("should not submit when surface exceeds maxSurfaceArea converted to percentage", async () => {
      const onSubmitSpy = vi.fn();

      render(
        <SurfaceAreaDistributionForm
          title="Test form"
          surfaces={[
            { name: "field1", label: "Field1", maxSurfaceArea: 25 },
            { name: "field2", label: "Field2" },
          ]}
          inputMode="percentage"
          onInputModeChange={vi.fn()}
          totalSurfaceArea={100}
          maxErrorMessage="Surface too large"
          onBack={() => {}}
          onSubmit={onSubmitSpy}
        />,
      );

      const input1 = await screen.findByRole("textbox", { name: /field1/i });
      const input2 = await screen.findByRole("textbox", { name: /field2/i });
      const submitButton = await screen.findByRole("button", { name: /valider/i });

      // Enter 30% in field1, which exceeds its max of 25% (25 m² / 100 m²)
      fireEvent.input(input1, { target: { value: 30 } });
      fireEvent.input(input2, { target: { value: 70 } });
      fireEvent.submit(submitButton);

      await waitFor(() => {
        // oxlint-disable-next-line no-standalone-expect
        expect(screen.getByText("Surface too large")).toBeInTheDocument();
      });
      expect(onSubmitSpy).not.toHaveBeenCalled();
    });
  });
});
