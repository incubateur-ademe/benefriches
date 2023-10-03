import { PermeableArtificializedSoil } from "@/components/pages/SiteFoncier/friche";

export const getLabelForPermeableArtificialSoil = (
  value: PermeableArtificializedSoil,
) => {
  switch (value) {
    case PermeableArtificializedSoil.MINERAL:
      return "Sol minéral (parking ou voirie en gravier, dalles alvéolées...)";
    case PermeableArtificializedSoil.GRASS_OR_BUSHES_FILLED:
      return "Sol enherbé et arbustif (parc ou jardin en pelouse, aménagement paysager)";
    case PermeableArtificializedSoil.TREE_FILLED:
      return "Sol arboré (parc ou jardin avec des arbres plantés)";
  }
};
