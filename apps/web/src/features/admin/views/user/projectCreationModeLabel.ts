import type { ReconversionProjectCreationMode } from "shared";

export const getProjectCreationModeLabel = (mode: ReconversionProjectCreationMode): string => {
  switch (mode) {
    case "express":
      return "Démo";
    case "custom":
      return "Personnalisé";
    case "duplicated":
      return "Dupliqué";
    case "csv-import":
      return "Import CSV";
  }
};
