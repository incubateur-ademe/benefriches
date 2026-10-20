import type { ReconversionCompatibilityEvaluationStatus } from "shared";

export const getCompatibilityEvaluationStatusLabel = (
  status: ReconversionCompatibilityEvaluationStatus | null,
): string => {
  switch (status) {
    case "started":
      return "En cours";
    case "completed":
      return "Terminée";
    case "related_site_created":
      return "Site créé";
    case null:
      return "-";
  }
};
