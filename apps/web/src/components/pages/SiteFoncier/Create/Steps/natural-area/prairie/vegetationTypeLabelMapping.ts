import { VegetationType } from "@/components/pages/SiteFoncier/naturalArea";

export const getLabelForVegetationType = (vegetationType: VegetationType) => {
  switch (vegetationType) {
    case VegetationType.BUSHES:
      return "Arbustes";
    case VegetationType.GRASS:
      return "Herbes";
    case VegetationType.TREES:
      return "Arbres";
  }
};
