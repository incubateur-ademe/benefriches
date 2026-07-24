import { SiteNature, sumListWithKey } from "shared";

import { AvoidedCostsUrbanSprawlAnalysisDataView } from "@/features/projects/application/project-impacts/selectors/projectAvoidedCostsAnalysis.selectors";
import classNames from "@/shared/views/clsx";
import Badge from "@/shared/views/components/Badge/Badge";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";
import { getPictogramUrlForSiteNature } from "@/shared/views/siteNature";

import { ProjectDevelopmentPlanType } from "../../../core/projects.types";
import { getScenarioPictoUrl } from "../../shared/scenarioType";
import ComparisionDetailsMonetaryRow from "../layout/ComparisionDetailsMonetaryRow";
import ComparisonCell from "../layout/ComparisonCell";
import ComparisonGrid from "../layout/ComparisonGrid";
import ComparisonMonetaryRow from "../layout/ComparisonMonetaryRow";
import ScenarioHeader from "../layout/ScenarioHeader";
import SectionHeader from "../layout/SectionHeader";

type Props = {
  projectType: ProjectDevelopmentPlanType;
  siteNature: SiteNature;
} & AvoidedCostsUrbanSprawlAnalysisDataView;

const getTextForSiteNature = (siteNature: SiteNature) => {
  switch (siteNature) {
    case "FRICHE":
      return "la friche";
    case "AGRICULTURAL_OPERATION":
      return "l'exploitation agricole";
    case "NATURAL_AREA":
      return "l'espace de nature";
  }
};

const getTotal = (arr1: { total: number }[] = [], arr2: { total: number }[] = []) => {
  return sumListWithKey(arr1.concat(arr2), "total");
};

const UrbanSprawlBadge = () => (
  <Badge small className="bg-[#F2F3EC] text-[#505134]">
    Coût de l'étalement urbain
  </Badge>
);

const ProjectBreakEvenLevelResult = ({
  breakEvenYear,
  projectionYears,
}: {
  breakEvenYear?: string;
  projectionYears: string[];
}) => {
  const isIconSuccess = breakEvenYear !== undefined;
  const breakEvenIndex = breakEvenYear ? projectionYears.indexOf(breakEvenYear) : undefined;

  return (
    <div className="flex items-center gap-2">
      <span
        aria-hidden="true"
        className={classNames(
          "text-[32px]/tight font-bold rounded-lg",
          "fr-icon--right fr-icon fr-icon--xl",
          isIconSuccess
            ? ["fr-icon-checkbox-circle-fill", "before:bg-development-score-grade-a"]
            : ["fr-icon-close-circle-fill before:bg-development-score-grade-e"],
        )}
      ></span>
      <div>
        {projectionYears[0] === breakEvenYear ? (
          <>
            <div className="text-xl font-bold">La première année</div>
            <div>Soit en {breakEvenYear}</div>
          </>
        ) : breakEvenIndex ? (
          <>
            <div className="text-xl font-bold">
              En {breakEvenIndex} {breakEvenIndex > 1 ? "ans" : "an"}
            </div>
            <div>Soit en {breakEvenYear}</div>
          </>
        ) : (
          <span>Pas avant au moins {projectionYears.at(-1)}</span>
        )}
      </div>
    </div>
  );
};

export default function ProjectAvoidedUrbanSprawlCosts({
  projectType,
  siteNature,
  projectImpacts: pi,
  urbanSprawlSimulation: uss,
  dataLoadingState,
}: Props) {
  if (dataLoadingState === "loading") {
    return <LoadingSpinner />;
  }

  if (dataLoadingState === "error") {
    return (
      <section className="bg-warning-ultralight dark:bg-warning-ultradark p-6 rounded-lg mb-4">
        <span
          aria-hidden="true"
          className="fr-icon--lg fr-icon-error-warning-line dark:before:text-warning-ultralight before:text-warning-ultradark flex mb-4"
        ></span>
        <p className="text-xl font-black">
          Une erreur s'est produite lors de la récupération des données...
        </p>
        <p>Recharger la page ou contacter le support</p>
      </section>
    );
  }

  if (dataLoadingState !== "success") {
    return null;
  }

  const isFriche = siteNature === "FRICHE";

  const isBearerSectionVisible = (bearer: "localAuthority" | "localPeopleOrCompany" | "humanity") =>
    pi.projectOnSiteImpactsByBearerAndCategory[bearer].total !== 0 ||
    uss.projectOnSimulationSiteImpactsByBearerAndCategory[bearer].total !== 0 ||
    pi.siteStatuQuoImpactsByBearerAndCategory[bearer].total !== 0 ||
    uss.simulationSiteStatuQuoImpactsByBearerAndCategory[bearer].total !== 0;

  return (
    <ComparisonGrid>
      <ComparisonCell />

      <ScenarioHeader
        pictoUrl={getScenarioPictoUrl(projectType)}
        badge={!isFriche ? <UrbanSprawlBadge /> : undefined}
        label={
          <div>
            Projet sur {getTextForSiteNature(siteNature)}{" "}
            <span className="text-sm">
              {isFriche ? "et exploitation agricole en activité" : "et friche non reconvertie"}
            </span>
          </div>
        }
      />

      <ScenarioHeader
        pictoUrl={
          isFriche
            ? getPictogramUrlForSiteNature("AGRICULTURAL_OPERATION")
            : getPictogramUrlForSiteNature("FRICHE")
        }
        badge={isFriche ? <UrbanSprawlBadge /> : undefined}
        label={
          <div>
            {isFriche ? (
              <>
                Projet sur exploitation agricole{" "}
                <span className="text-sm">et friche non reconvertie</span>
              </>
            ) : (
              <>
                Projet sur friche{" "}
                <span className="text-sm">et {getTextForSiteNature(siteNature)} en activité</span>
              </>
            )}
          </div>
        }
      />

      <ComparisonCell firstCol bold size="lg" className="h-28">
        Coût de l'opération compensé
        <div className="font-normal text-base mt-3">(par les impacts socio-économiques)</div>
      </ComparisonCell>

      <ComparisonCell value={pi.aggregatedReconversionImpacts.breakEvenYear ? 1 : -1}>
        <ProjectBreakEvenLevelResult
          projectionYears={pi.projectionYears}
          breakEvenYear={pi.aggregatedReconversionImpacts.breakEvenYear}
        />
      </ComparisonCell>

      <ComparisonCell value={uss.breakEvenYear ? 1 : -1}>
        <ProjectBreakEvenLevelResult
          projectionYears={uss.projectionYears}
          breakEvenYear={uss.breakEvenYear}
        />
      </ComparisonCell>

      <SectionHeader>Coût-bénéfice</SectionHeader>

      <ComparisonMonetaryRow
        label="Bilan de l'opération"
        labelBold
        projectValue={pi.projectEconomicBalance.total}
        scenarioValue={uss.projectEconomicBalance.total}
      />

      <ComparisonMonetaryRow
        label="Impacts socio-économiques"
        labelBold
        projectValue={
          pi.reconversionImpactsBreakdown.projectOnSiteIndirectEconomicImpactsData.total +
          uss.simulationSiteStatuQuoImpactsData.total
        }
        scenarioValue={
          pi.reconversionImpactsBreakdown.siteStatuQuoIndirectEconomicImpactsData.total +
          uss.projectOnSimulationSiteImpactsData.total
        }
      />

      <ComparisonMonetaryRow
        label="Total coût-bénéfice"
        labelBold
        totalRow
        projectValue={
          pi.projectEconomicBalance.total +
          pi.reconversionImpactsBreakdown.projectOnSiteIndirectEconomicImpactsData.total +
          uss.simulationSiteStatuQuoImpactsData.total
        }
        scenarioValue={
          uss.projectEconomicBalance.total +
          pi.reconversionImpactsBreakdown.siteStatuQuoIndirectEconomicImpactsData.total +
          uss.projectOnSimulationSiteImpactsData.total
        }
      />

      <SectionHeader>Détails des impacts socio-économiques</SectionHeader>

      <ComparisonMonetaryRow
        label="🏛️ Pour la collectivité locale"
        labelBold
        projectValue={
          pi.projectOnSiteImpactsByBearerAndCategory.localAuthority.total +
          uss.simulationSiteStatuQuoImpactsByBearerAndCategory.localAuthority.total
        }
        scenarioValue={
          uss.projectOnSimulationSiteImpactsByBearerAndCategory.localAuthority.total +
          pi.siteStatuQuoImpactsByBearerAndCategory.localAuthority.total
        }
      />

      <ComparisonMonetaryRow
        label="🏘 Pour les riverains"
        labelBold
        projectValue={
          pi.projectOnSiteImpactsByBearerAndCategory.localPeopleOrCompany.total +
          uss.simulationSiteStatuQuoImpactsByBearerAndCategory.localPeopleOrCompany.total
        }
        scenarioValue={
          uss.projectOnSimulationSiteImpactsByBearerAndCategory.localPeopleOrCompany.total +
          pi.siteStatuQuoImpactsByBearerAndCategory.localPeopleOrCompany.total
        }
      />

      <ComparisonMonetaryRow
        label="🌍 Pour la société"
        labelBold
        projectValue={
          pi.projectOnSiteImpactsByBearerAndCategory.humanity.total +
          uss.simulationSiteStatuQuoImpactsByBearerAndCategory.humanity.total
        }
        scenarioValue={
          uss.projectOnSimulationSiteImpactsByBearerAndCategory.humanity.total +
          pi.siteStatuQuoImpactsByBearerAndCategory.humanity.total
        }
      />

      {isBearerSectionVisible("localAuthority") && (
        <>
          <SectionHeader>Impacts économiques pour la collectivité locale</SectionHeader>

          <ComparisionDetailsMonetaryRow
            label="🏚️ Dépenses liées à la friche"
            left={sumListWithKey(
              uss.simulationSiteStatuQuoImpactsByBearerAndCategory.localAuthority.fricheCosts ?? [],
              "total",
            )}
            right={sumListWithKey(
              pi.siteStatuQuoImpactsByBearerAndCategory.localAuthority.fricheCosts ?? [],
              "total",
            )}
          />

          <ComparisionDetailsMonetaryRow
            label="🔧 Dépenses communales"
            left={getTotal(
              pi.projectOnSiteImpactsByBearerAndCategory.localAuthority.municipalityExpenses,
              uss.simulationSiteStatuQuoImpactsByBearerAndCategory.localAuthority
                .municipalityExpenses,
            )}
            right={getTotal(
              uss.projectOnSimulationSiteImpactsByBearerAndCategory.localAuthority
                .municipalityExpenses,
              pi.siteStatuQuoImpactsByBearerAndCategory.localAuthority.municipalityExpenses,
            )}
          />

          <ComparisionDetailsMonetaryRow
            label="🏛 Recettes fiscales"
            left={getTotal(
              pi.projectOnSiteImpactsByBearerAndCategory.localAuthority.taxesIncome,
              uss.simulationSiteStatuQuoImpactsByBearerAndCategory.localAuthority.taxesIncome,
            )}
            right={getTotal(
              uss.projectOnSimulationSiteImpactsByBearerAndCategory.localAuthority.taxesIncome,
              pi.siteStatuQuoImpactsByBearerAndCategory.localAuthority.taxesIncome,
            )}
          />

          <ComparisionDetailsMonetaryRow
            label="💰 Bénéfice d'exploitation"
            left={getTotal(
              pi.projectOnSiteImpactsByBearerAndCategory.localAuthority.operatingEconomicBalance,
              uss.simulationSiteStatuQuoImpactsByBearerAndCategory.localAuthority
                .operatingEconomicBalance,
            )}
            right={getTotal(
              uss.projectOnSimulationSiteImpactsByBearerAndCategory.localAuthority
                .operatingEconomicBalance,
              pi.siteStatuQuoImpactsByBearerAndCategory.localAuthority.operatingEconomicBalance,
            )}
          />

          <ComparisionDetailsMonetaryRow
            label="🔑 Revenu locatif"
            left={getTotal(
              pi.projectOnSiteImpactsByBearerAndCategory.localAuthority.rentalIncome,
              uss.simulationSiteStatuQuoImpactsByBearerAndCategory.localAuthority.rentalIncome,
            )}
            right={getTotal(
              uss.projectOnSimulationSiteImpactsByBearerAndCategory.localAuthority.rentalIncome,
              pi.siteStatuQuoImpactsByBearerAndCategory.localAuthority.rentalIncome,
            )}
          />

          <ComparisonMonetaryRow
            label="Total des impacts pour la collectivité locale"
            labelBold
            totalRow
            projectValue={
              pi.projectOnSiteImpactsByBearerAndCategory.localAuthority.total +
              uss.simulationSiteStatuQuoImpactsByBearerAndCategory.localAuthority.total
            }
            scenarioValue={
              pi.siteStatuQuoImpactsByBearerAndCategory.localAuthority.total +
              uss.projectOnSimulationSiteImpactsByBearerAndCategory.localAuthority.total
            }
          />
        </>
      )}

      {isBearerSectionVisible("localPeopleOrCompany") && (
        <>
          <SectionHeader>Impacts économiques pour les riverains</SectionHeader>

          <ComparisionDetailsMonetaryRow
            label="🏚️ Dépenses liées à la friche"
            left={sumListWithKey(
              uss.simulationSiteStatuQuoImpactsByBearerAndCategory.localPeopleOrCompany
                .fricheCosts ?? [],
              "total",
            )}
            right={sumListWithKey(
              pi.siteStatuQuoImpactsByBearerAndCategory.localPeopleOrCompany.fricheCosts ?? [],
              "total",
            )}
          />

          <ComparisionDetailsMonetaryRow
            label="👛 Pouvoir d'achat supplémentaire"
            left={sumListWithKey(
              pi.projectOnSiteImpactsByBearerAndCategory.localPeopleOrCompany
                .purchasingPowerIncrease ?? [],
              "total",
            )}
            right={sumListWithKey(
              uss.projectOnSimulationSiteImpactsByBearerAndCategory.localPeopleOrCompany
                .purchasingPowerIncrease ?? [],
              "total",
            )}
          />

          <ComparisionDetailsMonetaryRow
            label="💰 Bénéfice d'exploitation"
            left={getTotal(
              pi.projectOnSiteImpactsByBearerAndCategory.localPeopleOrCompany
                .operatingEconomicBalance,
              uss.simulationSiteStatuQuoImpactsByBearerAndCategory.localPeopleOrCompany
                .operatingEconomicBalance,
            )}
            right={getTotal(
              uss.projectOnSimulationSiteImpactsByBearerAndCategory.localPeopleOrCompany
                .operatingEconomicBalance,
              pi.siteStatuQuoImpactsByBearerAndCategory.localPeopleOrCompany
                .operatingEconomicBalance,
            )}
          />

          <ComparisionDetailsMonetaryRow
            label="🔑 Revenu locatif"
            left={getTotal(
              pi.projectOnSiteImpactsByBearerAndCategory.localPeopleOrCompany.rentalIncome,
              uss.simulationSiteStatuQuoImpactsByBearerAndCategory.localPeopleOrCompany
                .rentalIncome,
            )}
            right={getTotal(
              uss.projectOnSimulationSiteImpactsByBearerAndCategory.localPeopleOrCompany
                .rentalIncome,
              pi.siteStatuQuoImpactsByBearerAndCategory.localPeopleOrCompany.rentalIncome,
            )}
          />

          <ComparisionDetailsMonetaryRow
            label="🏡 Valeur patrimoniale supplémentaire autour de la friche"
            left={sumListWithKey(
              pi.projectOnSiteImpactsByBearerAndCategory.localPeopleOrCompany
                .localPropertyValueIncrease ?? [],
              "total",
            )}
            right={sumListWithKey(
              uss.projectOnSimulationSiteImpactsByBearerAndCategory.localPeopleOrCompany
                .localPropertyValueIncrease ?? [],
              "total",
            )}
          />

          <ComparisonMonetaryRow
            label="Total des impacts pour les riverains"
            labelBold
            totalRow
            projectValue={
              pi.projectOnSiteImpactsByBearerAndCategory.localPeopleOrCompany.total +
              uss.simulationSiteStatuQuoImpactsByBearerAndCategory.localPeopleOrCompany.total
            }
            scenarioValue={
              pi.siteStatuQuoImpactsByBearerAndCategory.localPeopleOrCompany.total +
              uss.projectOnSimulationSiteImpactsByBearerAndCategory.localPeopleOrCompany.total
            }
          />
        </>
      )}

      {isBearerSectionVisible("humanity") && (
        <>
          <SectionHeader>Impacts économiques pour la société française et mondiale</SectionHeader>

          <ComparisionDetailsMonetaryRow
            label="🫀 Économies sur les dépenses de santé"
            left={sumListWithKey(
              pi.projectOnSiteImpactsByBearerAndCategory.humanity.avoidedHealthExpenses ?? [],
              "total",
            )}
            right={sumListWithKey(
              uss.projectOnSimulationSiteImpactsByBearerAndCategory.humanity
                .avoidedHealthExpenses ?? [],
              "total",
            )}
          />

          <ComparisionDetailsMonetaryRow
            label="🌿 Valeur de l'action environnementale"
            left={getTotal(
              pi.projectOnSiteImpactsByBearerAndCategory.humanity.environmentalAction,
              uss.simulationSiteStatuQuoImpactsByBearerAndCategory.humanity.environmentalAction,
            )}
            right={getTotal(
              uss.projectOnSimulationSiteImpactsByBearerAndCategory.humanity.environmentalAction,
              pi.siteStatuQuoImpactsByBearerAndCategory.humanity.environmentalAction,
            )}
          />

          <ComparisonMonetaryRow
            label="Total des impacts pour la société"
            labelBold
            totalRow
            projectValue={
              pi.projectOnSiteImpactsByBearerAndCategory.humanity.total +
              uss.simulationSiteStatuQuoImpactsByBearerAndCategory.humanity.total
            }
            scenarioValue={
              pi.siteStatuQuoImpactsByBearerAndCategory.humanity.total +
              uss.projectOnSimulationSiteImpactsByBearerAndCategory.humanity.total
            }
          />
        </>
      )}
    </ComparisonGrid>
  );
}
