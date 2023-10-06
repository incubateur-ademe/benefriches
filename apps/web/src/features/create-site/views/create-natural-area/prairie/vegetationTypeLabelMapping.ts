import { VegetationType } from "@/features/create-site/domain/naturalArea.types";

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
