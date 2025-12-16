import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { PropsWithChildren } from "react";
import { Provider } from "react-redux";
import { expect, vi } from "vitest";

import { createStore } from "@/shared/core/store-config/store";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import ExportImpactsModal from "./ExportModal";

// Mock PdfExportDownload since it has complex dependencies
vi.mock("./pdf-export", () => ({
  default: ({ selectedSections }: { selectedSections: Record<string, boolean> }) => (
    <span data-testid="pdf-export-download">{JSON.stringify(selectedSections)}</span>
  ),
}));

function renderWithProviders(ui: React.ReactElement) {
  const store = createStore(getTestAppDependencies());
  const Wrapper = ({ children }: PropsWithChildren) => (
    <Provider store={store}>{children}</Provider>
  );
  return render(ui, { wrapper: Wrapper });
}

describe("ExportImpactsModal", () => {
  // DSFR dialog renders content as hidden, so we need to use { hidden: true } option
  it("should have 'Télécharger' button disabled when no format is selected", () => {
    renderWithProviders(<ExportImpactsModal projectId="project-1" siteId="site-1" />);

    const downloadButton = screen.getByRole("button", { name: "Télécharger", hidden: true });
    expect(downloadButton).toBeDisabled();
  });

  it("should have Excel and Share link options disabled", async () => {
    renderWithProviders(<ExportImpactsModal projectId="project-1" siteId="site-1" />);

    const excelRadio = screen.getByRole("radio", { name: /Tableur Excel/, hidden: true });
    expect(excelRadio).toBeDisabled();

    const shareLinkRadio = screen.getByRole("radio", { name: /Lien à partager/, hidden: true });
    expect(shareLinkRadio).toBeDisabled();
  });

  it("should show 'Suivant' button when PDF is selected on format selection step", async () => {
    renderWithProviders(<ExportImpactsModal projectId="project-1" siteId="site-1" />);

    const pdfRadio = screen.getByRole("radio", { name: "PDF", hidden: true });
    fireEvent.click(pdfRadio);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Suivant", hidden: true })).toBeInTheDocument();
    });
  });

  it("should have all checkboxes checked by default on PDF sections step", async () => {
    renderWithProviders(<ExportImpactsModal projectId="project-1" siteId="site-1" />);

    const pdfRadio = screen.getByRole("radio", { name: "PDF", hidden: true });
    fireEvent.click(pdfRadio);

    const nextButton = screen.getByRole("button", { name: "Suivant", hidden: true });
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText("Caractéristiques du site")).toBeInTheDocument();
    });

    // All checkboxes should be checked
    const checkboxes = screen.getAllByRole("checkbox", { hidden: true });
    expect(checkboxes).toHaveLength(7);
    checkboxes.forEach((checkbox) => {
      expect(checkbox).toBeChecked();
    });
  });

  it("should render PdfExportDownload only after clicking 'Générer le PDF'", async () => {
    renderWithProviders(<ExportImpactsModal projectId="project-1" siteId="site-1" />);

    const pdfRadio = screen.getByRole("radio", { name: "PDF", hidden: true });
    fireEvent.click(pdfRadio);

    const nextButton = screen.getByRole("button", { name: "Suivant", hidden: true });
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText("Caractéristiques du site")).toBeInTheDocument();
    });

    // PdfExportDownload should not be rendered yet
    expect(screen.queryByTestId("pdf-export-download")).not.toBeInTheDocument();

    // Click "Générer le PDF" button
    const generateButton = screen.getByRole("button", { name: "Générer le PDF", hidden: true });
    fireEvent.click(generateButton);

    // Now PdfExportDownload should be rendered
    await waitFor(() => {
      expect(screen.getByTestId("pdf-export-download")).toBeInTheDocument();
    });
  });

  it("should disable 'Générer le PDF' button when no sections are selected", async () => {
    renderWithProviders(<ExportImpactsModal projectId="project-1" siteId="site-1" />);

    const pdfRadio = screen.getByRole("radio", { name: "PDF", hidden: true });
    fireEvent.click(pdfRadio);

    const nextButton = screen.getByRole("button", { name: "Suivant", hidden: true });
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText("Caractéristiques du site")).toBeInTheDocument();
    });

    // Uncheck all checkboxes
    const checkboxes = screen.getAllByRole("checkbox", { hidden: true });
    checkboxes.forEach((checkbox) => {
      fireEvent.click(checkbox);
    });

    // Generate button should be disabled
    const generateButton = screen.getByRole("button", { name: "Générer le PDF", hidden: true });
    expect(generateButton).toBeDisabled();
  });

  it("should pass selected sections to PdfExportDownload after generation", async () => {
    renderWithProviders(<ExportImpactsModal projectId="project-1" siteId="site-1" />);

    const pdfRadio = screen.getByRole("radio", { name: "PDF", hidden: true });
    fireEvent.click(pdfRadio);

    const nextButton = screen.getByRole("button", { name: "Suivant", hidden: true });
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText("Caractéristiques du site")).toBeInTheDocument();
    });

    // Uncheck site features
    const siteFeaturesCheckbox = screen.getByRole("checkbox", {
      name: /Caractéristiques du site/,
      hidden: true,
    });
    fireEvent.click(siteFeaturesCheckbox);

    // Click "Générer le PDF" button
    const generateButton = screen.getByRole("button", { name: "Générer le PDF", hidden: true });
    fireEvent.click(generateButton);

    // The mocked PdfExportDownload should show the selection state
    await waitFor(() => {
      expect(screen.getByTestId("pdf-export-download")).toBeInTheDocument();
    });

    const pdfExportDownload = screen.getByTestId("pdf-export-download");
    const selectedSections = JSON.parse(pdfExportDownload.textContent ?? "{}");

    expect(selectedSections.siteFeatures).toBe(false);
    expect(selectedSections.projectFeatures).toBe(true);
    expect(selectedSections.economicBalance).toBe(true);
  });

  it("should show 'Retour' button on PDF sections step and go back to format selection", async () => {
    renderWithProviders(<ExportImpactsModal projectId="project-1" siteId="site-1" />);

    const pdfRadio = screen.getByRole("radio", { name: "PDF", hidden: true });
    fireEvent.click(pdfRadio);

    const nextButton = screen.getByRole("button", { name: "Suivant", hidden: true });
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText("Caractéristiques du site")).toBeInTheDocument();
    });

    // Should show "Retour" button instead of "Annuler"
    expect(screen.getByRole("button", { name: "Retour", hidden: true })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Annuler", hidden: true })).not.toBeInTheDocument();

    // Click "Retour" button
    const backButton = screen.getByRole("button", { name: "Retour", hidden: true });
    fireEvent.click(backButton);

    // Should be back to format selection step
    await waitFor(() => {
      expect(screen.getByRole("radio", { name: "PDF", hidden: true })).toBeInTheDocument();
    });

    expect(screen.queryByText("Caractéristiques du site")).not.toBeInTheDocument();
  });
});
