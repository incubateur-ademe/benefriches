import type {
  PdfExportSectionId,
  PdfExportSectionSelection,
} from "../export-impacts/pdf-export/pdfExportSections";
import type { pageIds } from "./pageIds";

type SubSection = {
  key: PdfExportSectionId;
  label: string;
  pageId: keyof typeof pageIds;
};

type TopLevelSection = {
  key: PdfExportSectionId | "impacts";
  label: string;
  pageId: keyof typeof pageIds;
  subSections?: SubSection[];
};

const impactsSubSections: SubSection[] = [
  { key: "economicBalance", label: "Bilan de l'opération", pageId: "impacts-economic-balance" },
  {
    key: "socioEconomicImpacts",
    label: "Impacts socio-économiques",
    pageId: "impacts-socio-economic",
  },
  { key: "socialImpacts", label: "Impacts sociaux", pageId: "impacts-social" },
  {
    key: "environmentalImpacts",
    label: "Impacts environnementaux",
    pageId: "impacts-environment",
  },
];

export const sectionsConfig: TopLevelSection[] = [
  { key: "siteFeatures", label: "Caractéristiques du site", pageId: "site-features" },
  { key: "projectFeatures", label: "Caractéristiques du projet", pageId: "project-features" },
  {
    key: "impacts",
    label: "Impacts du projet",
    pageId: "impacts",
    subSections: impactsSubSections,
  },
  { key: "aboutBenefriches", label: "Notice explicative", pageId: "explanatory-note" },
];

export type TableOfContentEntry = {
  label: string;
  pageId: keyof typeof pageIds;
  subsections?: { label: string; pageId: keyof typeof pageIds }[];
};

export type TableOfContent = TableOfContentEntry[];

export const getSectionLabel = (
  tableOfContents: TableOfContent,
  pageId: keyof typeof pageIds,
): string => {
  for (const entry of tableOfContents) {
    if (entry.subsections) {
      // Check subsections first (important because main entry pageId might match a subsection)
      for (const sub of entry.subsections) {
        if (sub.pageId === pageId) {
          return sub.label;
        }
      }

      // Check if this is the parent section (impacts) - pageId matches config but not TOC entry
      const parentConfig = sectionsConfig.find((s) =>
        s.subSections?.some((sub) => sub.pageId === entry.pageId),
      );
      if (parentConfig?.pageId === pageId) {
        return entry.label;
      }
    }

    // Check main entry (only if it doesn't have subsections, or we're looking for the exact pageId)
    if (entry.pageId === pageId && !entry.subsections) {
      return entry.label;
    }
  }
  return "";
};

export const buildTableOfContents = (
  selectedSections: PdfExportSectionSelection,
): TableOfContent => {
  const entries: TableOfContent = [];
  let mainSectionNumber = 0;

  for (const section of sectionsConfig) {
    const isTopLevelSectionWithSubsections = Array.isArray(section.subSections);

    if (!isTopLevelSectionWithSubsections) {
      const shouldIncludeSection =
        section.key in selectedSections && selectedSections[section.key as PdfExportSectionId];

      if (shouldIncludeSection) {
        mainSectionNumber++;

        const subSectionsEntries = section.subSections
          ?.filter((sub) => selectedSections[sub.key])
          .map((sub, index) => ({
            label: `${mainSectionNumber}.${index + 1} ${sub.label}`,
            pageId: sub.pageId,
          }));

        entries.push({
          label: `${mainSectionNumber}. ${section.label}`,
          pageId: section.pageId,
          subsections: subSectionsEntries,
        });
      }
    } else {
      const subsectionsToInclude = section.subSections!.filter((sub) => selectedSections[sub.key]);

      if (subsectionsToInclude.length === 0) continue;

      mainSectionNumber++;
      const firstSubsection = subsectionsToInclude[0];

      const subsectionsEntries = subsectionsToInclude.map((sub, index) => ({
        label: `${mainSectionNumber}.${index + 1} ${sub.label}`,
        pageId: sub.pageId,
      }));
      entries.push({
        label: `${mainSectionNumber}. ${section.label}`,
        pageId: firstSubsection!.pageId,
        subsections: subsectionsEntries,
      });
    }
  }

  return entries;
};
