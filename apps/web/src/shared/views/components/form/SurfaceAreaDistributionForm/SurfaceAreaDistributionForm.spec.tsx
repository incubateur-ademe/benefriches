import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { PropsWithChildren } from "react";
import { Provider } from "react-redux";
import { expect } from "vitest";

import { DEFAULT_APP_SETTINGS } from "@/features/app-settings/core/appSettings";
import { SQUARE_METERS_HTML_SYMBOL } from "@/shared/core/format-number/formatNumber";
import { createStore, RootState } from "@/shared/core/store-config/store";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import SurfaceAreaDistributionForm from "./SurfaceAreaDistributionForm";

const percentageInputModePreloadedState = {
  appSettings: {
    ...DEFAULT_APP_SETTINGS,
    surfaceAreaInputMode: "percentage",
  },
} as const;

const squareMetersInputModePreloadedState = {
  appSettings: {
    ...DEFAULT_APP_SETTINGS,
    surfaceAreaInputMode: "squareMeters",
  },
} as const;

type RenderOptions = {
  preloadedState?: Partial<RootState>;
};
function renderWithProviders(ui: React.ReactElement, renderOptions: RenderOptions = {}) {
  const store = createStore(getTestAppDependencies(), renderOptions.preloadedState);
  const Wrapper = ({ children }: PropsWithChildren) => (
    <Provider store={store}>{children}</Provider>
  );

  // Return an object with the store and all of RTL's query functions
  return {
    ...render(ui, { wrapper: Wrapper }),
  };
}

describe("SurfaceAreaDistributionForm", () => {
  describe("with input mode: square meters", () => {
    it("should not submit and display remaining surface to allocate when no surface area has been entered", async () => {
      const onSubmitSpy = vi.fn();

      renderWithProviders(
        <SurfaceAreaDistributionForm
          title="Test form"
          surfaces={[
            { name: "field1", label: "Field1" },
            { name: "field2", label: "Field2" },
          ]}
          totalSurfaceArea={50}
          onBack={() => {}}
          onSubmit={onSubmitSpy}
        />,
        { preloadedState: squareMetersInputModePreloadedState },
      );
      const controlInput = await screen.findByText("Total de toutes les surfaces");

      expect(controlInput).toHaveTextContent("50 ㎡ manquants");
      fireEvent.submit(screen.getByRole("button", { name: "Valider" }));

      expect(screen.getByRole("button", { name: "Valider" })).toBeDisabled();
      await waitFor(() => {
        expect(onSubmitSpy).not.toHaveBeenCalled();
      });
    });

    it("should be able to submit when form is valid", async () => {
      const onSubmitSpy = vi.fn();

      renderWithProviders(
        <SurfaceAreaDistributionForm
          title="Test form"
          surfaces={[
            { name: "field1", label: "Field1" },
            { name: "field2", label: "Field2" },
            { name: "field3", label: "Field3" },
          ]}
          totalSurfaceArea={50}
          onBack={() => {}}
          onSubmit={onSubmitSpy}
        />,
        { preloadedState: squareMetersInputModePreloadedState },
      );
      const input1 = await screen.findByRole("spinbutton", { name: /field1/i });
      const input2 = await screen.findByRole("spinbutton", { name: /field2/i });
      const controlInput = await screen.findByText("Total de toutes les surfaces");
      const submitButton = await screen.findByRole("button", { name: /valider/i });

      expect(controlInput).toHaveTextContent("50 ㎡ manquants");
      fireEvent.input(input1, { target: { value: 30 } });
      fireEvent.input(input2, { target: { value: 20 } });
      expect(controlInput).toHaveTextContent("Le compte est bon");
      expect(screen.getByRole("button", { name: "Valider" })).not.toBeDisabled();

      fireEvent.submit(submitButton);

      await waitFor(() => {
        expect(onSubmitSpy).toHaveBeenCalledWith({ field1: 30, field2: 20 });
      });
    });

    it("should only submit surface areas with positive values and convert percent values to square meters", async () => {
      const onSubmitSpy = vi.fn();

      renderWithProviders(
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
        { preloadedState: percentageInputModePreloadedState },
      );
      const submitButton = await screen.findByRole("button", { name: /valider/i });
      const input1 = await screen.findByRole("spinbutton", { name: /field1/i });
      const input2 = await screen.findByRole("spinbutton", { name: /field2/i });
      const input3 = await screen.findByRole("spinbutton", { name: /field3/i });
      const input4 = await screen.findByRole("spinbutton", { name: /field4/i });

      fireEvent.input(input1, { target: { value: 70 } });
      fireEvent.input(input2, { target: { value: undefined } });
      fireEvent.input(input3, { target: { value: 0 } });
      fireEvent.input(input4, { target: { value: 30 } });

      expect(input1).toHaveValue(70);
      expect(input2).toHaveValue(null);
      expect(input3).toHaveValue(0);
      expect(input4).toHaveValue(30);

      expect(screen.getByRole("button", { name: "Valider" })).not.toBeDisabled();

      fireEvent.submit(submitButton);

      await waitFor(() => {
        expect(onSubmitSpy).toHaveBeenCalledWith({ field1: 7000, field4: 3000 });
      });
    });

    it("should let user switch to percentage mode", async () => {
      renderWithProviders(
        <SurfaceAreaDistributionForm
          title="Test form"
          surfaces={[
            { name: "field1", label: "Field1" },
            { name: "field2", label: "Field2" },
          ]}
          totalSurfaceArea={50}
          onBack={() => {}}
          onSubmit={() => {}}
        />,
        { preloadedState: squareMetersInputModePreloadedState },
      );
      const input1 = await screen.findByRole("spinbutton", { name: /field1/i });
      const input2 = await screen.findByRole("spinbutton", { name: /field2/i });
      const percentageModeButton = await screen.findByLabelText("%");

      // enter surface areas in square meters
      fireEvent.input(input1, { target: { value: 35 } });
      fireEvent.input(input2, { target: { value: 15 } });

      // switch from square meters to percentage
      fireEvent.click(percentageModeButton);
      expect(input1).toHaveValue(70);
      expect(input2).toHaveValue(30);
    });
  });

  describe("with input mode: percentage", () => {
    it("should not submit and display remaining surface to allocate when no surface area has been entered", async () => {
      const onSubmitSpy = vi.fn();

      renderWithProviders(
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
        { preloadedState: percentageInputModePreloadedState },
      );
      const controlInput = await screen.findByText("Total de toutes les surfaces");

      expect(controlInput).toHaveTextContent("100% manquants");
      fireEvent.submit(screen.getByRole("button", { name: "Valider" }));

      expect(screen.getByRole("button", { name: "Valider" })).toBeDisabled();
      await waitFor(() => {
        expect(onSubmitSpy).not.toHaveBeenCalled();
      });
    });

    it("should be able to submit when form is valid and convert percent values to square meters", async () => {
      const onSubmitSpy = vi.fn();

      renderWithProviders(
        <SurfaceAreaDistributionForm
          title="Test form"
          surfaces={[
            { name: "field1", label: "Field1" },
            { name: "field2", label: "Field2" },
            { name: "field3", label: "Field3" },
          ]}
          totalSurfaceArea={10000}
          onBack={() => {}}
          onSubmit={onSubmitSpy}
        />,
        { preloadedState: percentageInputModePreloadedState },
      );
      const submitButton = await screen.findByRole("button", { name: /valider/i });
      const input1 = await screen.findByRole("spinbutton", { name: /field1/i });
      const input2 = await screen.findByRole("spinbutton", { name: /field2/i });
      const controlInput = await screen.findByText("Total de toutes les surfaces");

      expect(controlInput).toHaveTextContent("100% manquants");
      fireEvent.input(input1, { target: { value: 70 } });
      fireEvent.input(input2, { target: { value: 30 } });

      expect(input1).toHaveValue(70);
      expect(input2).toHaveValue(30);
      expect(controlInput).toHaveTextContent("Le compte est bon");
      expect(screen.getByRole("button", { name: "Valider" })).not.toBeDisabled();

      fireEvent.submit(submitButton);

      await waitFor(() => {
        expect(onSubmitSpy).toHaveBeenCalledWith({ field1: 7000, field2: 3000 });
      });
    });
    it("should only submit surface areas with positive values and convert percent values to square meters", async () => {
      const onSubmitSpy = vi.fn();

      renderWithProviders(
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
        { preloadedState: percentageInputModePreloadedState },
      );
      const submitButton = await screen.findByRole("button", { name: /valider/i });
      const input1 = await screen.findByRole("spinbutton", { name: /field1/i });
      const input2 = await screen.findByRole("spinbutton", { name: /field2/i });
      const input3 = await screen.findByRole("spinbutton", { name: /field3/i });
      const input4 = await screen.findByRole("spinbutton", { name: /field4/i });

      fireEvent.input(input1, { target: { value: 70 } });
      fireEvent.input(input2, { target: { value: undefined } });
      fireEvent.input(input3, { target: { value: 0 } });
      fireEvent.input(input4, { target: { value: 30 } });

      expect(input1).toHaveValue(70);
      expect(input2).toHaveValue(null);
      expect(input3).toHaveValue(0);
      expect(input4).toHaveValue(30);

      expect(screen.getByRole("button", { name: "Valider" })).not.toBeDisabled();

      fireEvent.submit(submitButton);

      await waitFor(() => {
        expect(onSubmitSpy).toHaveBeenCalledWith({ field1: 7000, field4: 3000 });
      });
    });

    it("should let user switch to square meters mode", async () => {
      renderWithProviders(
        <SurfaceAreaDistributionForm
          title="Test form"
          surfaces={[
            { name: "field1", label: "Field1" },
            { name: "field2", label: "Field2" },
          ]}
          totalSurfaceArea={50}
          onBack={() => {}}
          onSubmit={() => {}}
        />,
        { preloadedState: percentageInputModePreloadedState },
      );
      const input1 = await screen.findByRole("spinbutton", { name: /field1/i });
      const input2 = await screen.findByRole("spinbutton", { name: /field2/i });
      const squareMetersButton = await screen.findByLabelText(SQUARE_METERS_HTML_SYMBOL);

      // enter surface areas in percentage
      fireEvent.input(input1, { target: { value: 30 } });
      fireEvent.input(input2, { target: { value: 70 } });

      // switch from percentage to square meters
      fireEvent.click(squareMetersButton);
      expect(input1).toHaveValue(15);
      expect(input2).toHaveValue(35);
    });
  });
});
