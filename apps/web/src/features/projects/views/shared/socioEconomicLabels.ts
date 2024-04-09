import { ReconversionProjectImpacts } from "../../domain/impacts.types";

export const getActorLabel = (
  label: ReconversionProjectImpacts["socioeconomic"]["impacts"][number]["actor"],
) => {
  switch (label) {
    case "community":
      return "Collectivité";
    case "human_society":
      return "Société humaine";
    default:
      return label;
  }
};
