import { formatNumberFr } from "shared";

import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";

export type LandValuesExplanationProps = {
  landWithoutBuildingsMedianPricePerSquareMeters?: number | undefined;
  accuracy: "city" | "france";
  cityName?: string;
  addressLabel: string;
};

export default ({
  accuracy,
  landWithoutBuildingsMedianPricePerSquareMeters,
  cityName,
  addressLabel,
}: LandValuesExplanationProps) => {
  return (
    <>
      <p>
        Les montants sont calculés d'après le prix moyen / m² des terrains{" "}
        {accuracy === "city" ? "dans cette zone géographique" : "en France"}
      </p>
      {landWithoutBuildingsMedianPricePerSquareMeters && (
        <p className="font-bold">
          Valeurs de référence des prix / m² pour{" "}
          {accuracy === "city" ? (cityName ?? addressLabel) : "la France"} :{" "}
          {formatNumberFr(landWithoutBuildingsMedianPricePerSquareMeters)}€
        </p>
      )}
      <ExternalLink href="https://explore.data.gouv.fr/fr/immobilier?onglet=carte&filtre=tous">
        Explorateur de données de valeurs foncières
      </ExternalLink>
    </>
  );
};
