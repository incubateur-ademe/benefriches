import { SiteNature } from "shared";

import { AvoidedCostsUrbanSprawlAnalysisDataView } from "@/features/projects/application/project-impacts/projectAvoidedCostsAnalysis.selectors";
import classNames from "@/shared/views/clsx";
import Badge from "@/shared/views/components/Badge/Badge";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";
import { getPictogramUrlForSiteNature } from "@/shared/views/siteNature";

import { ProjectDevelopmentPlanType } from "../../../domain/projects.types";
import { getScenarioPictoUrl } from "../../shared/scenarioType";
import ComparisionDetailsMonetaryRow from "../layout/ComparisionDetailsMonetaryRow";
import ComparisonCell from "../layout/ComparisonCell";
import ComparisonGrid from "../layout/ComparisonGrid";
import ComparisonMonetaryRow from "../layout/ComparisonMonetaryRow";
import ScenarioHeader from "../layout/ScenarioHeader";
import SectionHeader from "../layout/SectionHeader";
import {
  AVOIDED_HEALTH_EXPENSE_NAMES,
  BUYING_POWER_NAMES,
  ECOSYSTEM_SERVICE_NAMES,
  ENVIRONMENTAL_ACTION_NAMES,
  extractByName,
  FRICHE_COST_NAMES,
  PROJECT_MUNICIPALITY_EXPENSE_NAMES,
  SITE_STATU_QUO_MUNICIPALITY_EXPENSE_NAMES,
  TAX_INCOME_NAMES,
} from "../layout/byBearer.helper";

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

  const isBearerSectionVisible = (
    bearer: "local_authority" | "local_people_or_company" | "humanity",
  ) =>
    pi.projectOnSiteImpactsbyBearer[bearer].total !== 0 ||
    uss.projectOnSimulationSiteImpactsbyBearer[bearer].total !== 0 ||
    pi.siteStatuQuoImpactsByBearer[bearer].total !== 0 ||
    uss.simulationSiteStatuQuoImpactsByBearer[bearer].total !== 0;

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
          pi.projectOnSiteImpactsbyBearer.local_authority.total +
          uss.simulationSiteStatuQuoImpactsByBearer.local_authority.total
        }
        scenarioValue={
          uss.projectOnSimulationSiteImpactsbyBearer.local_authority.total +
          pi.siteStatuQuoImpactsByBearer.local_authority.total
        }
      />

      <ComparisonMonetaryRow
        label="🏘 Pour les riverains"
        labelBold
        projectValue={
          pi.projectOnSiteImpactsbyBearer.local_people_or_company.total +
          uss.simulationSiteStatuQuoImpactsByBearer.local_people_or_company.total
        }
        scenarioValue={
          uss.projectOnSimulationSiteImpactsbyBearer.local_people_or_company.total +
          pi.siteStatuQuoImpactsByBearer.local_people_or_company.total
        }
      />

      <ComparisonMonetaryRow
        label="🌍 Pour la société"
        labelBold
        projectValue={
          pi.projectOnSiteImpactsbyBearer.humanity.total +
          uss.simulationSiteStatuQuoImpactsByBearer.humanity.total
        }
        scenarioValue={
          uss.projectOnSimulationSiteImpactsbyBearer.humanity.total +
          pi.siteStatuQuoImpactsByBearer.humanity.total
        }
      />

      {isBearerSectionVisible("local_authority") && (
        <>
          <SectionHeader>Impacts économiques pour la collectivité locale</SectionHeader>

          <ComparisionDetailsMonetaryRow
            label="🏚️ Dépenses liées à la friche"
            left={extractByName(
              uss.simulationSiteStatuQuoImpactsByBearer.local_authority.details,
              FRICHE_COST_NAMES,
            )}
            right={extractByName(
              pi.siteStatuQuoImpactsByBearer.local_authority.details,
              FRICHE_COST_NAMES,
            )}
          />

          <ComparisionDetailsMonetaryRow
            label="🔧 Dépenses communales"
            left={extractByName(
              pi.projectOnSiteImpactsbyBearer.local_authority.details,
              PROJECT_MUNICIPALITY_EXPENSE_NAMES,
            ).concat(
              extractByName(
                uss.simulationSiteStatuQuoImpactsByBearer.local_authority.details,
                SITE_STATU_QUO_MUNICIPALITY_EXPENSE_NAMES,
              ),
            )}
            right={extractByName(
              uss.projectOnSimulationSiteImpactsbyBearer.local_authority.details,
              PROJECT_MUNICIPALITY_EXPENSE_NAMES,
            ).concat(
              extractByName(
                pi.siteStatuQuoImpactsByBearer.local_authority.details,
                SITE_STATU_QUO_MUNICIPALITY_EXPENSE_NAMES,
              ),
            )}
          />

          <ComparisionDetailsMonetaryRow
            label="🏛 Recettes fiscales"
            left={extractByName(
              pi.projectOnSiteImpactsbyBearer.local_authority.details,
              TAX_INCOME_NAMES,
            ).concat(
              extractByName(uss.simulationSiteStatuQuoImpactsByBearer.local_authority.details, [
                "taxesIncome",
              ]),
            )}
            right={extractByName(
              uss.projectOnSimulationSiteImpactsbyBearer.local_authority.details,
              TAX_INCOME_NAMES,
            ).concat(
              extractByName(pi.siteStatuQuoImpactsByBearer.local_authority.details, [
                "taxesIncome",
              ]),
            )}
          />

          <ComparisionDetailsMonetaryRow
            label="💰 Bénéfice d'exploitation"
            left={extractByName(pi.projectOnSiteImpactsbyBearer.local_authority.details, [
              "projectOperatingEconomicBalance",
            ]).concat(
              extractByName(uss.simulationSiteStatuQuoImpactsByBearer.local_authority.details, [
                "operatingEconomicBalance",
              ]),
            )}
            right={extractByName(
              uss.projectOnSimulationSiteImpactsbyBearer.local_authority.details,
              ["projectOperatingEconomicBalance"],
            ).concat(
              extractByName(pi.siteStatuQuoImpactsByBearer.local_authority.details, [
                "operatingEconomicBalance",
              ]),
            )}
          />

          <ComparisionDetailsMonetaryRow
            label="🔑 Revenu locatif"
            left={extractByName(pi.projectOnSiteImpactsbyBearer.local_authority.details, [
              "projectedRentalIncome",
            ]).concat(
              extractByName(uss.simulationSiteStatuQuoImpactsByBearer.local_authority.details, [
                "rentalIncome",
              ]),
            )}
            right={extractByName(
              uss.projectOnSimulationSiteImpactsbyBearer.local_authority.details,
              ["projectedRentalIncome"],
            ).concat(
              extractByName(pi.siteStatuQuoImpactsByBearer.local_authority.details, [
                "rentalIncome",
              ]),
            )}
          />

          <ComparisonMonetaryRow
            label="Total des impacts pour la collectivité locale"
            labelBold
            totalRow
            projectValue={
              pi.projectOnSiteImpactsbyBearer.local_authority.total +
              uss.simulationSiteStatuQuoImpactsByBearer.local_authority.total
            }
            scenarioValue={
              pi.siteStatuQuoImpactsByBearer.local_authority.total +
              uss.projectOnSimulationSiteImpactsbyBearer.local_authority.total
            }
          />
        </>
      )}

      {isBearerSectionVisible("local_people_or_company") && (
        <>
          <SectionHeader>Impacts économiques pour les riverains</SectionHeader>

          <ComparisionDetailsMonetaryRow
            label="🏚️ Dépenses liées à la friche"
            left={extractByName(
              uss.simulationSiteStatuQuoImpactsByBearer.local_people_or_company.details,
              FRICHE_COST_NAMES,
            )}
            right={extractByName(
              pi.siteStatuQuoImpactsByBearer.local_people_or_company.details,
              FRICHE_COST_NAMES,
            )}
          />

          <ComparisionDetailsMonetaryRow
            label="👛 Pouvoir d'achat supplémentaire"
            left={extractByName(
              pi.projectOnSiteImpactsbyBearer.local_people_or_company.details,
              BUYING_POWER_NAMES,
            )}
            right={extractByName(
              uss.projectOnSimulationSiteImpactsbyBearer.local_people_or_company.details,
              BUYING_POWER_NAMES,
            )}
          />

          <ComparisionDetailsMonetaryRow
            label="💰 Bénéfice d'exploitation"
            left={extractByName(pi.projectOnSiteImpactsbyBearer.local_people_or_company.details, [
              "projectOperatingEconomicBalance",
            ]).concat(
              extractByName(
                uss.simulationSiteStatuQuoImpactsByBearer.local_people_or_company.details,
                ["operatingEconomicBalance"],
              ),
            )}
            right={extractByName(
              uss.projectOnSimulationSiteImpactsbyBearer.local_people_or_company.details,
              ["projectOperatingEconomicBalance"],
            ).concat(
              extractByName(pi.siteStatuQuoImpactsByBearer.local_people_or_company.details, [
                "operatingEconomicBalance",
              ]),
            )}
          />

          <ComparisionDetailsMonetaryRow
            label="🔑 Revenu locatif"
            left={extractByName(pi.projectOnSiteImpactsbyBearer.local_people_or_company.details, [
              "projectedRentalIncome",
            ]).concat(
              extractByName(
                uss.simulationSiteStatuQuoImpactsByBearer.local_people_or_company.details,
                ["rentalIncome"],
              ),
            )}
            right={extractByName(
              uss.projectOnSimulationSiteImpactsbyBearer.local_people_or_company.details,
              ["projectedRentalIncome"],
            ).concat(
              extractByName(pi.siteStatuQuoImpactsByBearer.local_people_or_company.details, [
                "rentalIncome",
              ]),
            )}
          />

          <ComparisionDetailsMonetaryRow
            label="🏡 Valeur patrimoniale supplémentaire autour de la friche"
            left={extractByName(pi.projectOnSiteImpactsbyBearer.local_people_or_company.details, [
              "localPropertyValueIncrease",
            ])}
            right={extractByName(
              uss.projectOnSimulationSiteImpactsbyBearer.local_people_or_company.details,
              ["localPropertyValueIncrease"],
            )}
          />

          <ComparisonMonetaryRow
            label="Total des impacts pour les riverains"
            labelBold
            totalRow
            projectValue={
              pi.projectOnSiteImpactsbyBearer.local_people_or_company.total +
              uss.simulationSiteStatuQuoImpactsByBearer.local_people_or_company.total
            }
            scenarioValue={
              pi.siteStatuQuoImpactsByBearer.local_people_or_company.total +
              uss.projectOnSimulationSiteImpactsbyBearer.local_people_or_company.total
            }
          />
        </>
      )}

      {isBearerSectionVisible("humanity") && (
        <>
          <SectionHeader>Impacts économiques pour la société française et mondiale</SectionHeader>

          <ComparisionDetailsMonetaryRow
            label="🫀 Économies sur les dépenses de santé"
            left={extractByName(
              pi.projectOnSiteImpactsbyBearer.humanity.details,
              AVOIDED_HEALTH_EXPENSE_NAMES,
            )}
            right={extractByName(
              uss.projectOnSimulationSiteImpactsbyBearer.humanity.details,
              AVOIDED_HEALTH_EXPENSE_NAMES,
            )}
          />

          <ComparisionDetailsMonetaryRow
            label="🌿 Valeur de l'action environnementale"
            left={extractByName(
              pi.projectOnSiteImpactsbyBearer.humanity.details,
              ENVIRONMENTAL_ACTION_NAMES,
            ).concat(
              extractByName(
                uss.simulationSiteStatuQuoImpactsByBearer.humanity.details,
                ECOSYSTEM_SERVICE_NAMES,
              ),
            )}
            right={extractByName(
              uss.projectOnSimulationSiteImpactsbyBearer.humanity.details,
              ENVIRONMENTAL_ACTION_NAMES,
            ).concat(
              extractByName(
                pi.siteStatuQuoImpactsByBearer.humanity.details,
                ECOSYSTEM_SERVICE_NAMES,
              ),
            )}
          />

          <ComparisonMonetaryRow
            label="Total des impacts pour la société"
            labelBold
            totalRow
            projectValue={
              pi.projectOnSiteImpactsbyBearer.humanity.total +
              uss.simulationSiteStatuQuoImpactsByBearer.humanity.total
            }
            scenarioValue={
              pi.siteStatuQuoImpactsByBearer.humanity.total +
              uss.projectOnSimulationSiteImpactsbyBearer.humanity.total
            }
          />
        </>
      )}
    </ComparisonGrid>
  );
}
