import { computeDefaultDecontaminatedSurfaceArea } from "shared";
import z from "zod";

// "partial" = "Oui" (the user enters the surface), "none" = "Non" (0 m²),
// "unknown" = "Ne sait pas" (Bénéfriches applies the 25% default to the contaminated soils).
export const decontaminationPlanSchema = z.enum(["partial", "none", "unknown"]);
export type DecontaminationPlan = z.infer<typeof decontaminationPlanSchema>;

// Surface stored with the plan: 0 for "none", the 25% default for "unknown", the user input
// for "partial".
export const resolveDecontaminatedSurfaceArea = ({
  decontaminationPlan,
  enteredSurfaceArea,
  contaminatedSoilSurface,
}: {
  decontaminationPlan: DecontaminationPlan;
  enteredSurfaceArea: number | undefined;
  contaminatedSoilSurface: number;
}): number | undefined => {
  switch (decontaminationPlan) {
    case "none":
      return 0;
    case "unknown":
      return computeDefaultDecontaminatedSurfaceArea(contaminatedSoilSurface);
    case "partial":
      return enteredSurfaceArea;
  }
};

// Saved projects only store the surface: infer the plan back from it. A surface entered as
// exactly the 25% default reads back as "unknown", which resolves to the same surface.
export const inferDecontaminationPlan = (
  decontaminatedSurfaceArea: number,
  contaminatedSoilSurface: number,
): DecontaminationPlan => {
  if (decontaminatedSurfaceArea === 0) return "none";
  if (
    decontaminatedSurfaceArea === computeDefaultDecontaminatedSurfaceArea(contaminatedSoilSurface)
  ) {
    return "unknown";
  }
  return "partial";
};
