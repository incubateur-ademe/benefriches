import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import type { SoilType, UrbanProjectUse } from "shared";
import { expect } from "vitest";

import SpacesSelectionForm from "./SpacesSelectionForm";

const getCheckboxInputs = () =>
  screen.getAllByRole("checkbox").filter((el): el is HTMLInputElement => el.tagName === "INPUT");

describe("SpacesSelectionForm", () => {
  const defaultProps = {
    initialValues: [] as SoilType[],
    onSubmit: vi.fn(),
    onBack: vi.fn(),
    selectableSoils: [
      "BUILDINGS",
      "IMPERMEABLE_SOILS",
      "MINERAL_SOIL",
      "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
    ] as SoilType[],
    nonGreenSpacesUses: ["RESIDENTIAL", "COMMERCIAL_OR_TERTIARY"] as UrbanProjectUse[],
    hasPublicGreenSpaces: false,
  };

  describe("title", () => {
    it("should display use name in title when there is a single non-green-space use", () => {
      render(<SpacesSelectionForm {...defaultProps} nonGreenSpacesUses={["RESIDENTIAL"]} />);

      expect(
        screen.getByText(/Quels types de sols et espaces y aura-t-il au sein de l'usage/),
      ).toBeInTheDocument();
    });

    it("should display 'autres usages' title when hasPublicGreenSpaces and multiple uses", () => {
      render(
        <SpacesSelectionForm
          {...defaultProps}
          nonGreenSpacesUses={["RESIDENTIAL", "LOCAL_STORE"]}
          hasPublicGreenSpaces={true}
        />,
      );

      expect(
        screen.getByText(/Quels types de sols et espaces y aura-t-il au sein des autres usages/),
      ).toBeInTheDocument();
    });

    it("should display generic project title when no public green spaces and multiple uses", () => {
      render(
        <SpacesSelectionForm
          {...defaultProps}
          nonGreenSpacesUses={["RESIDENTIAL", "LOCAL_SERVICES"]}
          hasPublicGreenSpaces={false}
        />,
      );

      expect(
        screen.getByText(/Quels types de sols et espaces y aura-t-il au sein du projet urbain/),
      ).toBeInTheDocument();
    });
  });

  describe("uses description", () => {
    it("should display uses list when hasPublicGreenSpaces and multiple uses", () => {
      render(
        <SpacesSelectionForm
          {...defaultProps}
          nonGreenSpacesUses={["RESIDENTIAL", "LOCAL_STORE"]}
          hasPublicGreenSpaces={true}
        />,
      );

      expect(screen.getByText(/Logements/)).toBeInTheDocument();
    });

    it("should not display uses list when hasPublicGreenSpaces is false", () => {
      render(
        <SpacesSelectionForm
          {...defaultProps}
          nonGreenSpacesUses={["RESIDENTIAL", "LOCAL_STORE"]}
          hasPublicGreenSpaces={false}
        />,
      );

      expect(
        screen.queryByText("Logements, Commerces et activités tertiaires"),
      ).not.toBeInTheDocument();
    });
  });

  describe("soil options rendering", () => {
    it("should only render selectable soils", () => {
      render(
        <SpacesSelectionForm {...defaultProps} selectableSoils={["BUILDINGS", "MINERAL_SOIL"]} />,
      );

      expect(getCheckboxInputs()).toHaveLength(2);
    });

    it("should not render categories with no selectable soils", () => {
      render(<SpacesSelectionForm {...defaultProps} selectableSoils={["BUILDINGS"]} />);

      expect(screen.getByText("Espaces minéraux")).toBeInTheDocument();
      expect(screen.queryByText("Espaces artificiels végétalisés")).not.toBeInTheDocument();
      expect(screen.queryByText("Forêts")).not.toBeInTheDocument();
    });

    it("should render category headings for displayed soils", () => {
      render(
        <SpacesSelectionForm
          {...defaultProps}
          selectableSoils={["BUILDINGS", "ARTIFICIAL_GRASS_OR_BUSHES_FILLED", "FOREST_DECIDUOUS"]}
        />,
      );

      expect(screen.getByText("Espaces minéraux")).toBeInTheDocument();
      expect(screen.getByText("Espaces artificiels végétalisés")).toBeInTheDocument();
      expect(screen.getByText("Forêts")).toBeInTheDocument();
    });
  });

  describe("selection", () => {
    it("should pre-select initial values", () => {
      render(
        <SpacesSelectionForm
          {...defaultProps}
          selectableSoils={["BUILDINGS", "MINERAL_SOIL"]}
          initialValues={["BUILDINGS"]}
        />,
      );

      const inputs = getCheckboxInputs();
      expect(inputs.filter((input) => input.checked)).toHaveLength(1);
    });

    it("should toggle soil selection on click", async () => {
      render(
        <SpacesSelectionForm
          {...defaultProps}
          selectableSoils={["BUILDINGS", "MINERAL_SOIL"]}
          initialValues={[]}
        />,
      );

      const inputs = getCheckboxInputs();

      fireEvent.click(inputs[0]!);

      await waitFor(() => {
        // oxlint-disable-next-line no-standalone-expect
        expect(inputs[0]!.checked).toBe(true);
      });

      fireEvent.click(inputs[0]!);

      await waitFor(() => {
        // oxlint-disable-next-line no-standalone-expect
        expect(inputs[0]!.checked).toBe(false);
      });
    });
  });

  describe("form submission", () => {
    it("should call onSubmit with selected soils", async () => {
      const onSubmitSpy = vi.fn();
      render(
        <SpacesSelectionForm
          {...defaultProps}
          onSubmit={onSubmitSpy}
          selectableSoils={["BUILDINGS", "MINERAL_SOIL"]}
          initialValues={["BUILDINGS"]}
        />,
      );

      const submitButton = screen.getByRole("button", { name: /valider/i });
      fireEvent.submit(submitButton);

      await waitFor(() => {
        // oxlint-disable-next-line no-standalone-expect
        expect(onSubmitSpy).toHaveBeenCalledWith({ soils: ["BUILDINGS"] }, expect.anything());
      });
    });

    it("should call onBack when back button is clicked", () => {
      const onBackSpy = vi.fn();
      render(<SpacesSelectionForm {...defaultProps} onBack={onBackSpy} />);

      fireEvent.click(screen.getByRole("button", { name: /précédent/i }));

      expect(onBackSpy).toHaveBeenCalledOnce();
    });
  });

  describe("validation", () => {
    it("should show error message when submitting with no selection", async () => {
      render(
        <SpacesSelectionForm
          {...defaultProps}
          selectableSoils={["BUILDINGS"]}
          initialValues={[]}
        />,
      );

      const submitButton = screen.getByRole("button", { name: /valider/i });
      fireEvent.submit(submitButton);

      const errorMessage = await screen.findByText(
        "Veuillez sélectionner au moins un type d'espace.",
      );
      expect(errorMessage).toBeInTheDocument();
    });

    it("should not call onSubmit when no soils are selected", async () => {
      const onSubmitSpy = vi.fn();
      render(
        <SpacesSelectionForm
          {...defaultProps}
          onSubmit={onSubmitSpy}
          selectableSoils={["BUILDINGS"]}
          initialValues={[]}
        />,
      );

      const submitButton = screen.getByRole("button", { name: /valider/i });
      fireEvent.submit(submitButton);

      await screen.findByText("Veuillez sélectionner au moins un type d'espace.");
      expect(onSubmitSpy).not.toHaveBeenCalled();
    });
  });
});
