import { TreeType } from "@/components/pages/SiteFoncier/siteFoncier";

export const getLabelForTreeType = (treeType: TreeType) => {
  switch (treeType) {
    case TreeType.DECIDUOUS:
      return "Feuillus";
    case TreeType.POPLAR:
      return "Peupleraie";
    case TreeType.RESINOUS:
      return "Résineux";
    case TreeType.MIXED:
      return "Mixte";
  }
};
