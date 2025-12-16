import { createContext, useContext } from "react";

import {
  getDefaultSectionSelection,
  type PdfExportSectionSelection,
} from "../export-impacts/pdf-export/pdfExportSections";
import { buildTableOfContents, getSectionLabel, type TableOfContent } from "./buildTableOfContents";
import type { pageIds } from "./pageIds";

type ExportImpactsContextValue = {
  projectName: string;
  siteName: string;
  selectedSections: PdfExportSectionSelection;
};

const defaultContextValue: ExportImpactsContextValue = {
  projectName: "",
  siteName: "",
  selectedSections: getDefaultSectionSelection(),
};

export const ExportImpactsContext = createContext<ExportImpactsContextValue>(defaultContextValue);

export const useTableOfContents = (): TableOfContent => {
  const { selectedSections } = useContext(ExportImpactsContext);
  return buildTableOfContents(selectedSections);
};

export const useSectionLabel = (pageId: keyof typeof pageIds): string => {
  const tableOfContents = useTableOfContents();
  return getSectionLabel(tableOfContents, pageId);
};
