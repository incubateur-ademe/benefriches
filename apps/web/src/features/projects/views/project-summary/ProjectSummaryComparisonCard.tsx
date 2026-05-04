import { useMemo } from "react";

import { routes } from "@/app/router";
import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";
import { formatCO2Impact } from "@/features/projects/views/shared/formatImpactValue";
import { getCo2EqEmissionsTonsInAverageFrenchAnnualEmissionsPerPerson } from "@/shared/core/carbonEmissions";
import { formatPerFrenchPersonAnnualEquivalent } from "@/shared/core/format-number/formatCarbonStorage";
import {
  formatNumberFr,
  formatPercentage,
  formatSurfaceArea,
} from "@/shared/core/format-number/formatNumber";
import classNames from "@/shared/views/clsx";

import { ProjectSummaryDataView } from "../../application/project-impacts/projectSummary.selector";

type Props = Pick<ProjectSummaryDataView, "mainImpactIndicator"> & { projectId: string };

export default function ProjectSummaryComparisonCard({ mainImpactIndicator, projectId }: Props) {
  const { title, value, description } = useMemo(() => {
    if (!mainImpactIndicator) return { title: "", value: "", description: "" };

    switch (mainImpactIndicator.name) {
      case "avoidedMaintenanceCostsForLocalAuthority":
      case "avoidedFricheCostsForLocalAuthority": {
        const { isSuccess, value } = mainImpactIndicator;
        return {
          title: isSuccess ? "Gains pour la collectivité" : "Pertes pour la collectivité",
          value: formatMonetaryImpact(value.amount),
          description: isSuccess
            ? "grâce à la reconversion de la friche"
            : "à cause du maintien de la friche",
        };
      }

      case "avoidedCo2eqEmissions": {
        const { isSuccess, value } = mainImpactIndicator;
        const co2eqValue = Math.abs(value);
        const frenchPersonEquivalent =
          getCo2EqEmissionsTonsInAverageFrenchAnnualEmissionsPerPerson(co2eqValue);
        const frenchPersonEquivalentText =
          formatPerFrenchPersonAnnualEquivalent(frenchPersonEquivalent);
        return {
          title: isSuccess ? "Émissions de CO2eq évitées" : "Émissions de CO2eq",
          value: formatCO2Impact(co2eqValue, { withSignPrefix: false }),
          description: `soit les émissions de ${frenchPersonEquivalentText} français pendant 1 an`,
        };
      }

      case "taxesIncomesImpact": {
        const { isSuccess, value } = mainImpactIndicator;
        return {
          title: isSuccess ? "Gains pour la collectivité" : "Pertes pour la collectivité",
          value: formatMonetaryImpact(value),
          description: isSuccess
            ? "grâce aux recettes fiscales supplémentaires"
            : "à cause d'une perte de recettes fiscales",
        };
      }

      case "fullTimeJobs": {
        const { isSuccess, value } = mainImpactIndicator;
        const { difference, percentageEvolution } = value;
        return {
          value: formatPercentage(percentageEvolution),
          title: isSuccess ? `ETP en hausse` : `ETP en baisse`,
          description: isSuccess
            ? `${formatNumberFr(difference)} emploi équivalent temps plein créé ou maintenu`
            : `${formatNumberFr(difference)} emploi équivalent temps plein perdu`,
        };
      }

      case "nonContaminatedSurfaceArea": {
        const { isSuccess, value } = mainImpactIndicator;
        const { decontaminatedSurfaceArea, forecastContaminatedSurfaceArea } = value;
        return {
          description: isSuccess
            ? "Les risques sanitaires seront réduits\u00a0☢️"
            : "Les risques sanitaires seront encore présents\u00a0☢️",
          value: isSuccess
            ? formatSurfaceArea(decontaminatedSurfaceArea)
            : formatSurfaceArea(forecastContaminatedSurfaceArea),
          title: isSuccess ? `de sols dépollués` : "de sols non dépollués",
        };
      }

      case "permeableSurfaceArea": {
        const { isSuccess, value } = mainImpactIndicator;
        const { difference, percentageEvolution } = value;
        return {
          title: isSuccess ? "Augmentation des sols perméables" : "Diminution des sols perméables",
          value: formatSurfaceArea(difference),
          description: isSuccess
            ? `${formatPercentage(percentageEvolution)} de sols désimperméabilisés`
            : `${formatPercentage(percentageEvolution)} de sols imperméabilisés`,
        };
      }

      case "householdsPoweredByRenewableEnergy": {
        const { value } = mainImpactIndicator;
        return {
          description: "grâce à la production photovoltaïque annelle",
          value: formatNumberFr(value),
          title: "nouveaux foyers alimentés en EnR",
        };
      }

      case "localPropertyValueIncrease": {
        const { value } = mainImpactIndicator;
        return {
          title: "Gains potentiels pour les riverains",
          value: formatMonetaryImpact(value),
          description:
            "grâce à la hausse de valeur patrimoniale attendue par la reconversion de la friche",
        };
      }

      default:
        return { title: "", value: "", description: "" };
    }
  }, [mainImpactIndicator]);

  return (
    <div className="border rounded-3xl p-6 flex flex-col justify-between">
      <div>
        <span
          className={classNames(
            "bg-success-ultralight",
            "fr-badge",
            "text-[32px]",
            "px-3",
            "py-4",
            "mb-4",
          )}
        >
          {value}
        </span>
        <h4 className={classNames("mb-4", "text-[32px]")}>{title}</h4>
        <p>{description}</p>
      </div>

      <div>
        <a className="fr-link" {...routes.urbanSprawlImpactsComparison({ projectId }).link}>
          Voir l'analyse comparative
        </a>
      </div>
    </div>
  );
}
