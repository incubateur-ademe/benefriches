import { describe, expect, it } from "vitest";

import type { PdfExportSectionSelection } from "../export-impacts/pdf-export/pdfExportSections";
import { buildTableOfContents, getSectionLabel, type TableOfContent } from "./buildTableOfContents";

const allSectionsSelected: PdfExportSectionSelection = {
  siteFeatures: true,
  projectFeatures: true,
  economicBalance: true,
  socioEconomicImpacts: true,
  socialImpacts: true,
  environmentalImpacts: true,
  aboutBenefriches: true,
};

const noSectionsSelected: PdfExportSectionSelection = {
  siteFeatures: false,
  projectFeatures: false,
  economicBalance: false,
  socioEconomicImpacts: false,
  socialImpacts: false,
  environmentalImpacts: false,
  aboutBenefriches: false,
};

describe("buildTableOfContents", () => {
  describe("only selected sections appear in TOC", () => {
    it("returns empty array when no sections are selected", () => {
      const result = buildTableOfContents(noSectionsSelected);

      expect(result).toEqual<TableOfContent>([]);
    });

    it("includes only the selected section", () => {
      const result = buildTableOfContents({
        ...noSectionsSelected,
        aboutBenefriches: true,
      });

      expect(result).toEqual<TableOfContent>([
        {
          label: "1. À propos de Bénéfriches",
          pageId: "about-benefriches",
        },
      ]);
    });

    it("excludes impacts section when no impact subsections are selected", () => {
      const result = buildTableOfContents({
        ...noSectionsSelected,
        siteFeatures: true,
        projectFeatures: true,
        aboutBenefriches: true,
      });

      expect(result).toEqual<TableOfContent>([
        { label: "1. Caractéristiques du site", pageId: "site-features" },
        { label: "2. Caractéristiques du projet", pageId: "project-features" },
        { label: "3. À propos de Bénéfriches", pageId: "about-benefriches" },
      ]);
    });
  });

  describe("correct numbering when all sections selected", () => {
    it("numbers main sections as 1, 2, 3, 4 and subsections as 3.1, 3.2, 3.3, 3.4", () => {
      const result = buildTableOfContents(allSectionsSelected);

      expect(result).toEqual<TableOfContent>([
        { label: "1. Caractéristiques du site", pageId: "site-features" },
        { label: "2. Caractéristiques du projet", pageId: "project-features" },
        {
          label: "3. Impacts du projet",
          pageId: "impacts-economic-balance",
          subsections: [
            { label: "3.1 Bilan de l'opération", pageId: "impacts-economic-balance" },
            { label: "3.2 Impacts socio-économiques", pageId: "impacts-socio-economic" },
            { label: "3.3 Impacts sociaux", pageId: "impacts-social" },
            { label: "3.4 Impacts environnementaux", pageId: "impacts-environment" },
          ],
        },
        { label: "4. À propos de Bénéfriches", pageId: "about-benefriches" },
      ]);
    });
  });

  describe("correct numbering when some sections excluded", () => {
    it("renumbers all sections when an early section is excluded", () => {
      const result = buildTableOfContents({
        ...allSectionsSelected,
        siteFeatures: false,
      });

      expect(result).toEqual<TableOfContent>([
        { label: "1. Caractéristiques du projet", pageId: "project-features" },
        {
          label: "2. Impacts du projet",
          pageId: "impacts-economic-balance",
          subsections: [
            { label: "2.1 Bilan de l'opération", pageId: "impacts-economic-balance" },
            { label: "2.2 Impacts socio-économiques", pageId: "impacts-socio-economic" },
            { label: "2.3 Impacts sociaux", pageId: "impacts-social" },
            { label: "2.4 Impacts environnementaux", pageId: "impacts-environment" },
          ],
        },
        { label: "3. À propos de Bénéfriches", pageId: "about-benefriches" },
      ]);
    });
  });

  describe("section with subsections only appears when at least one subsection is selected", () => {
    it("includes impacts section and links to first selected subsection", () => {
      const result = buildTableOfContents({
        ...noSectionsSelected,
        socialImpacts: true,
        environmentalImpacts: true,
      });

      expect(result).toEqual<TableOfContent>([
        {
          label: "1. Impacts du projet",
          pageId: "impacts-social",
          subsections: [
            { label: "1.1 Impacts sociaux", pageId: "impacts-social" },
            { label: "1.2 Impacts environnementaux", pageId: "impacts-environment" },
          ],
        },
      ]);
    });
  });

  describe("correct subsection numbering when some subsections are excluded", () => {
    it("renumbers subsections sequentially when some are excluded", () => {
      const result = buildTableOfContents({
        ...allSectionsSelected,
        economicBalance: false,
        socialImpacts: false,
      });

      expect(result).toEqual<TableOfContent>([
        { label: "1. Caractéristiques du site", pageId: "site-features" },
        { label: "2. Caractéristiques du projet", pageId: "project-features" },
        {
          label: "3. Impacts du projet",
          pageId: "impacts-socio-economic",
          subsections: [
            { label: "3.1 Impacts socio-économiques", pageId: "impacts-socio-economic" },
            { label: "3.2 Impacts environnementaux", pageId: "impacts-environment" },
          ],
        },
        { label: "4. À propos de Bénéfriches", pageId: "about-benefriches" },
      ]);
    });
  });
});

describe("getSectionLabel", () => {
  it("returns full label for main sections", () => {
    const toc = buildTableOfContents(allSectionsSelected);

    expect(getSectionLabel(toc, "site-features")).toBe("1. Caractéristiques du site");
    expect(getSectionLabel(toc, "project-features")).toBe("2. Caractéristiques du projet");
    expect(getSectionLabel(toc, "about-benefriches")).toBe("4. À propos de Bénéfriches");
  });

  it("returns full label for impacts parent section", () => {
    const toc = buildTableOfContents(allSectionsSelected);

    expect(getSectionLabel(toc, "impacts")).toBe("3. Impacts du projet");
  });

  it("returns full label for subsections", () => {
    const toc = buildTableOfContents(allSectionsSelected);

    expect(getSectionLabel(toc, "impacts-economic-balance")).toBe("3.1 Bilan de l'opération");
    expect(getSectionLabel(toc, "impacts-socio-economic")).toBe("3.2 Impacts socio-économiques");
    expect(getSectionLabel(toc, "impacts-social")).toBe("3.3 Impacts sociaux");
    expect(getSectionLabel(toc, "impacts-environment")).toBe("3.4 Impacts environnementaux");
  });

  it("returns updated labels when sections are excluded", () => {
    const toc = buildTableOfContents({
      ...allSectionsSelected,
      siteFeatures: false,
    });

    expect(getSectionLabel(toc, "project-features")).toBe("1. Caractéristiques du projet");
    expect(getSectionLabel(toc, "impacts")).toBe("2. Impacts du projet");
    expect(getSectionLabel(toc, "impacts-economic-balance")).toBe("2.1 Bilan de l'opération");
    expect(getSectionLabel(toc, "about-benefriches")).toBe("3. À propos de Bénéfriches");
  });

  it("returns empty string for excluded sections", () => {
    const toc = buildTableOfContents({
      ...allSectionsSelected,
      siteFeatures: false,
    });

    expect(getSectionLabel(toc, "site-features")).toBe("");
  });

  it("returns empty string for empty TOC", () => {
    const toc = buildTableOfContents(noSectionsSelected);

    expect(getSectionLabel(toc, "site-features")).toBe("");
    expect(getSectionLabel(toc, "impacts")).toBe("");
  });
});
