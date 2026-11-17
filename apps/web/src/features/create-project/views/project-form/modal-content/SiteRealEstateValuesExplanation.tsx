import {
  formatNumberFr,
  PERCENT_RATIO_PER_BUILDINGS_TYPE,
  roundToInteger,
  typedObjectEntries,
} from "shared";

import { getLabelForBuildingsUse } from "@/shared/core/urbanProject";
import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";

export type LandValuesExplanationProps = {
  propertyValueMedianPricePerSquareMeters: number;
  accuracy: "city" | "france";
  cityName?: string;
  addressLabel: string;
};

export default ({
  propertyValueMedianPricePerSquareMeters,
  accuracy,
  cityName,
  addressLabel,
}: LandValuesExplanationProps) => {
  return (
    <>
      <span className="title">D'où viennent les montants préremplis ?</span>
      <p>
        Montants calculés d'après le prix moyen / hectare du foncier{" "}
        {accuracy === "city" ? "dans cette zone géographique" : "en France"}
      </p>
      {propertyValueMedianPricePerSquareMeters && (
        <>
          <span className="font-bold">
            Valeurs de référence des prix / m² pour{" "}
            {accuracy === "city" ? (cityName ?? addressLabel) : "la France"}:
          </span>
          <ul className="text-sm">
            {typedObjectEntries(PERCENT_RATIO_PER_BUILDINGS_TYPE)
              .filter(([, value]) => value)
              .map(([cat, value = 0]) => (
                <li key={cat}>
                  {getLabelForBuildingsUse(cat)} :{" "}
                  {formatNumberFr(roundToInteger(value * propertyValueMedianPricePerSquareMeters))}€
                </li>
              ))}
          </ul>
        </>
      )}
      <ExternalLink href="https://explore.data.gouv.fr/fr/immobilier?onglet=carte&filtre=tous">
        Explorateur de données de valeurs foncières
      </ExternalLink>
    </>
  );
};
