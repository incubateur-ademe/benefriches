import {
  formatCO2Impact,
  formatEvolutionPercentage,
  formatMonetaryImpact,
  formatSurfaceAreaImpact,
} from "../../../shared/formatImpactValue";
import ImpactSyntheticCard from "./ImpactSyntheticCard";

import { formatPerFrenchPersonAnnualEquivalent } from "@/features/create-project/views/soils/soils-carbon-storage/formatCarbonStorage";
import { ImpactCategoryFilter } from "@/features/projects/application/projectImpacts.reducer";
import { getCo2EqEmissionsTonsInAverageFrenchAnnualEmissionsPerPerson } from "@/shared/domain/carbonEmissions";
import { formatNumberFr } from "@/shared/services/format-number/formatNumber";

type Props = {
  categoryFilter: ImpactCategoryFilter;
  isFriche: boolean;
  isAgriculturalFriche: boolean;
  impacts: {
    projectImpactBalance: {
      economicBalanceTotal: number;
      socioEconomicMonetaryImpactsTotal: number;
      projectBalance: number;
    };
    avoidedFricheCostsForLocalAuthority?: {
      actorName: string;
      amount: number;
    };
    taxesIncomesImpact?: number;
    fullTimeJobs: {
      percentageEvolution: number;
      value: number;
    };
    householdsPoweredByRenewableEnergy?: number;
    permeableSurfaceArea?: {
      percentageEvolution: number;
      value: number;
    };
    avoidedCo2eqEmissions: number;
    nonContaminatedSurfaceArea?: {
      percentageEvolution: number;
      value: number;
    };
    localPropertyValueIncrease?: number;
  };
};

const ImpactSynthesisView = ({
  categoryFilter,
  isFriche,
  isAgriculturalFriche,
  impacts,
}: Props) => {
  const {
    projectImpactBalance,
    avoidedFricheCostsForLocalAuthority,
    taxesIncomesImpact,
    householdsPoweredByRenewableEnergy,
    permeableSurfaceArea,
    avoidedCo2eqEmissions,
    fullTimeJobs,
    nonContaminatedSurfaceArea,
    localPropertyValueIncrease,
  } = impacts;

  const displayAll = categoryFilter === "all";
  const displayEconomicCards = displayAll || categoryFilter === "economic";
  const displayEnvironmentCards = displayAll || categoryFilter === "environment";
  const displaySocialCards = displayAll || categoryFilter === "social";

  return (
    <div className="tw-grid tw-grid-rows-1 lg:tw-grid-cols-3 tw-gap-6 tw-mb-8">
      {isFriche && (
        <ImpactSyntheticCard
          type={isAgriculturalFriche ? "error" : "success"}
          tooltipText={
            isAgriculturalFriche
              ? "Projet consommant des espaces agricoles"
              : "Reconversion d’un site en friche limitant la consommation d’espaces naturels, agricoles ou forestiers"
          }
          text={`Projet ${isAgriculturalFriche ? "défavorable" : "favorable"} au ZAN\u00a0🌾`}
        />
      )}
      {!isFriche && permeableSurfaceArea && permeableSurfaceArea.value < 0 && (
        <ImpactSyntheticCard
          type="error"
          tooltipText="Projet consommant des espaces naturels, agricoles ou forestiers et imperméabilisant les sols"
          text="Projet défavorable au ZAN&nbsp;🌾"
        />
      )}
      <ImpactSyntheticCard
        type={projectImpactBalance.projectBalance > 0 ? "success" : "error"}
        tooltipText={`${formatMonetaryImpact(projectImpactBalance.socioEconomicMonetaryImpactsTotal)} d’impacts socio-économiques contre ${formatMonetaryImpact(impacts.projectImpactBalance.economicBalanceTotal)} de bilan de l’opération`}
        text={
          projectImpactBalance.projectBalance > 0
            ? "Impacts avec une valeur qui compense le déficit\u00a0💰"
            : "Impacts avec une valeur plus faible que le déficit\u00a0💸"
        }
      />
      {displayEconomicCards && (
        <>
          {avoidedFricheCostsForLocalAuthority &&
            (avoidedFricheCostsForLocalAuthority.amount > 0 ? (
              <ImpactSyntheticCard
                type="success"
                tooltipText={`${formatMonetaryImpact(avoidedFricheCostsForLocalAuthority.amount)} économisés par ${avoidedFricheCostsForLocalAuthority.actorName} grâce à la reconversion de la friche`}
                text="- de dépenses de sécurisation&nbsp;💰"
              />
            ) : (
              <ImpactSyntheticCard
                type="error"
                tooltipText={`${formatMonetaryImpact(avoidedFricheCostsForLocalAuthority.amount)} toujours à la charge de ${avoidedFricheCostsForLocalAuthority.actorName}`}
                text="Des dépenses de sécurisation demeurent&nbsp;💸"
              />
            ))}

          {taxesIncomesImpact &&
            (taxesIncomesImpact > 0 ? (
              <ImpactSyntheticCard
                type="success"
                tooltipText={`${formatMonetaryImpact(taxesIncomesImpact)} à venir au profit notamment de la collectivité`}
                text="+ de recettes fiscales&nbsp;💰"
              />
            ) : (
              <ImpactSyntheticCard
                type="error"
                tooltipText={`${formatMonetaryImpact(taxesIncomesImpact)} en moins pour, notamment, la collectivité`}
                text="- de recettes fiscales&nbsp;💸"
              />
            ))}

          {localPropertyValueIncrease && localPropertyValueIncrease > 0 && (
            <ImpactSyntheticCard
              type="success"
              tooltipText={`${formatMonetaryImpact(localPropertyValueIncrease)} de valeur patrimoniale attendue par la reconversion de la friche`}
              text="+ d’attractivité&nbsp;🏡"
            />
          )}
        </>
      )}

      {displaySocialCards &&
        (fullTimeJobs.value > 0 ? (
          <ImpactSyntheticCard
            type="success"
            tooltipText={`${formatNumberFr(fullTimeJobs.value)} emploi équivalent temps plein créé ou maintenu (soit ${formatEvolutionPercentage(fullTimeJobs.percentageEvolution)})`}
            text="+ d’emplois&nbsp;👷"
          />
        ) : (
          <ImpactSyntheticCard
            type="error"
            tooltipText={`${formatNumberFr(fullTimeJobs.value)} emploi équivalent temps plein perdu (soit ${formatEvolutionPercentage(fullTimeJobs.percentageEvolution)})`}
            text="- d’emplois&nbsp;👷"
          />
        ))}

      {displayEnvironmentCards && (
        <>
          {householdsPoweredByRenewableEnergy && householdsPoweredByRenewableEnergy > 0 && (
            <ImpactSyntheticCard
              type="success"
              tooltipText={`${formatNumberFr(householdsPoweredByRenewableEnergy)} nouveaux foyers alimentés en EnR`}
              text="+ d’énergies renouvelables&nbsp;⚡"
            />
          )}
          {avoidedCo2eqEmissions > 0 ? (
            <ImpactSyntheticCard
              type="success"
              tooltipText={`${formatCO2Impact(avoidedCo2eqEmissions)} de CO2-éq évitées, soit les émissions de ${formatPerFrenchPersonAnnualEquivalent(getCo2EqEmissionsTonsInAverageFrenchAnnualEmissionsPerPerson(avoidedCo2eqEmissions))} français pendant 1 an`}
              text="- d’émissions de CO2&nbsp;☁️"
            />
          ) : (
            <ImpactSyntheticCard
              type="error"
              tooltipText={`${formatCO2Impact(avoidedCo2eqEmissions)} de CO2-éq émises, soit les émissions de ${formatPerFrenchPersonAnnualEquivalent(getCo2EqEmissionsTonsInAverageFrenchAnnualEmissionsPerPerson(avoidedCo2eqEmissions))}   français pendant 1 an`}
              text="+ d’émissions de CO2&nbsp;☁️"
            />
          )}
          {permeableSurfaceArea &&
            (permeableSurfaceArea.value > 0 ? (
              <ImpactSyntheticCard
                type="success"
                tooltipText={`${formatSurfaceAreaImpact(permeableSurfaceArea.value)} (soit ${formatEvolutionPercentage(permeableSurfaceArea.percentageEvolution)}) de sols désimperméabilisés`}
                text="+ de sols perméables&nbsp;☔️"
              />
            ) : (
              <ImpactSyntheticCard
                type="error"
                tooltipText={`${formatSurfaceAreaImpact(permeableSurfaceArea.value)} (soit ${formatEvolutionPercentage(permeableSurfaceArea.percentageEvolution)}) de sols imperméabilisés`}
                text="- de sols perméables&nbsp;☔️"
              />
            ))}
          {nonContaminatedSurfaceArea &&
            (nonContaminatedSurfaceArea.value > 0 ? (
              <ImpactSyntheticCard
                type="success"
                tooltipText={`${formatSurfaceAreaImpact(nonContaminatedSurfaceArea.value)} (soit ${formatEvolutionPercentage(nonContaminatedSurfaceArea.percentageEvolution)}) de sols non dépollués`}
                text="Des risques sanitaires réduits&nbsp;☢️"
              />
            ) : (
              <ImpactSyntheticCard
                type="error"
                tooltipText={`${formatSurfaceAreaImpact(nonContaminatedSurfaceArea.value)} de sols non dépollués`}
                text="des sols encore pollués&nbsp;☢️"
              />
            ))}
        </>
      )}
    </div>
  );
};

export default ImpactSynthesisView;
