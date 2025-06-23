import {
  sumListWithKey,
  EURO_PER_SQUARE_METERS_FOR_REMEDIATION,
  EURO_PER_SQUARE_METERS_FOR_DEMOLITION,
  EURO_PER_SQUARE_METERS_FOR_DEIMPERMEABILIZATION,
  EURO_PER_SQUARE_METERS_FOR_ASBESTOS_REMOVAL,
  EURO_PER_SQUARE_METERS_FOR_SUSTAINABLE_SOILS_REINSTATEMENT,
  roundToInteger,
  sumObjectValues,
} from "shared";

import {
  getLabelForDevelopmentPlanCategory,
  getLabelForRenewableEnergyProductionType,
} from "@/features/create-project/views/projectTypeLabelMapping";
import { ProjectFeatures } from "@/features/projects/domain/projects.types";
import { formatNumberFr } from "@/shared/core/format-number/formatNumber";
import {
  getLabelForFinancialAssistanceRevenueSource,
  getLabelForRecurringExpense,
  getLabelForRecurringRevenueSource,
  getLabelForReinstatementExpensePurpose,
} from "@/shared/core/reconversionProject";
import DataLine from "@/shared/views/components/FeaturesList/FeaturesListDataLine";
import ScheduleDates from "@/shared/views/components/FeaturesList/FeaturesListScheduleDates";
import Section from "@/shared/views/components/FeaturesList/FeaturesListSection";

import DevelopmentPlanFeatures from "./DevelopmentPlanFeatures";
import DevelopmentPlanInstallationExpenses from "./DevelopmentPlanInstallationExpenses";

type Props = {
  projectData: ProjectFeatures;
  onExpensesAndRevenuesTitleClick?: () => void;
};

export default function ProjectFeaturesView({
  projectData,
  onExpensesAndRevenuesTitleClick,
}: Props) {
  return (
    <>
      <Section title="🏗 Type de projet">
        <DataLine
          label={<strong>Type d'aménagement</strong>}
          value={
            projectData.developmentPlan.type === "PHOTOVOLTAIC_POWER_PLANT"
              ? getLabelForDevelopmentPlanCategory("RENEWABLE_ENERGY")
              : getLabelForDevelopmentPlanCategory(projectData.developmentPlan.type)
          }
        />
        {projectData.developmentPlan.type === "PHOTOVOLTAIC_POWER_PLANT" && (
          <DataLine
            label={<strong>Type d'énergies renouvelables</strong>}
            value={getLabelForRenewableEnergyProductionType("PHOTOVOLTAIC_POWER_PLANT")}
          />
        )}
      </Section>
      <DevelopmentPlanFeatures {...projectData} />

      <Section
        title="👱 Acteurs"
        tooltip="Il s’agit des entités ou personnes impliquées dans la réalisation du projet."
      >
        <DataLine
          label={<strong>Aménageur du site</strong>}
          value={projectData.developmentPlan.developerName ?? "Non renseigné"}
          valueTooltip={
            projectData.isExpress
              ? "On considère que l’aménageur est la collectivité, actuel propriétaire du site."
              : undefined
          }
        />
        <DataLine
          label={<strong>Futur propriétaire du site</strong>}
          labelTooltip="Le futur propriétaire est l’acteur à qui l’aménageur cèdera le terrain pour la réalisation du projet."
          value={projectData.futureOwner ?? "Pas de changement de propriétaire"}
        />
        {projectData.futureOperator && (
          <DataLine label={<strong>Futur exploitant</strong>} value={projectData.futureOperator} />
        )}
        {projectData.reinstatementContractOwner && (
          <DataLine
            label={<strong>Maître d'ouvrage des travaux de remise en état de la friche</strong>}
            value={projectData.reinstatementContractOwner}
            valueTooltip={
              projectData.isExpress
                ? "Bénéfriches considère que le maître d'ouvrage des travaux de remise en état de la friche est l’aménageur."
                : undefined
            }
          />
        )}
      </Section>
      <Section
        title="💰 Dépenses et recettes du projet"
        onTitleClick={onExpensesAndRevenuesTitleClick}
      >
        {projectData.sitePurchaseTotalAmount ? (
          <DataLine
            label={<strong>Prix d'achat du site et droits de mutation</strong>}
            value={<strong>{formatNumberFr(projectData.sitePurchaseTotalAmount)} €</strong>}
          />
        ) : undefined}
        {!!projectData.reinstatementCosts && (
          <>
            <DataLine
              noBorder
              label={<strong>Dépenses de remise en état de la friche</strong>}
              labelTooltip="Le recyclage foncier impose une phase de remise en état, avant aménagement : déconstruction, désamiantage, désimperméabilisation des sols, dépollution des milieux (sols, eaux souterraines, …),  restauration écologique des sols, etc. Cette phase génère des dépenses parfois importantes."
              value={
                <strong>
                  {formatNumberFr(sumListWithKey(projectData.reinstatementCosts, "amount"))} €
                </strong>
              }
            />
            {projectData.reinstatementCosts.map(({ amount, purpose }) => {
              return (
                <DataLine
                  label={getLabelForReinstatementExpensePurpose(purpose)}
                  value={`${formatNumberFr(amount)} €`}
                  isDetails
                  key={purpose}
                  labelTooltip={(() => {
                    switch (purpose) {
                      case "sustainable_soils_reinstatement":
                        return "La restauration écologique des sols consiste en la restauration des fonctionnalités écologiques des sols comme l’accueil de la biodiversité, le bon fonctionnement des cycles du carbone ou de l’eau.";
                    }
                  })()}
                  valueTooltip={(() => {
                    switch (purpose) {
                      case "sustainable_soils_reinstatement":
                        return `On considère que pour permettre la renaturation, il y a besoin de restauration écologique des sols qui coûte ${EURO_PER_SQUARE_METERS_FOR_SUSTAINABLE_SOILS_REINSTATEMENT} € / m² de surface de sol enherbé arbustif et sol arboré du projet. Cette valeur est issue du retour d’expérience ADEME.`;
                      case "deimpermeabilization":
                        return `On considère que la réduction de la surface imperméabilisée coûte ${EURO_PER_SQUARE_METERS_FOR_DEIMPERMEABILIZATION} € / m² surface désimperméabilisée. Cette valeur est issue du retour d’expérience ADEME.`;
                      case "remediation":
                        return `Le coût moyen de dépollution est estimé à ${EURO_PER_SQUARE_METERS_FOR_REMEDIATION} €/m². Cette valeur est issue du retour d’expérience ADEME.`;
                      case "demolition":
                        return `Le coût moyen de déconstruction est estimé à ${EURO_PER_SQUARE_METERS_FOR_DEMOLITION} €/m² de bâtiment. Cette valeur est issue du retour d’expérience ADEME.`;
                      case "asbestos_removal":
                        return `Le coût moyen de désamiantage est estimé à ${EURO_PER_SQUARE_METERS_FOR_ASBESTOS_REMOVAL} €/m² de bâtiment. Cette valeur est issue du retour d’expérience ADEME.`;
                    }
                  })()}
                />
              );
            })}
          </>
        )}
        {projectData.developmentPlan.installationCosts.length > 0 && (
          <DevelopmentPlanInstallationExpenses
            developmentPlanType={projectData.developmentPlan.type}
            installationCosts={projectData.developmentPlan.installationCosts}
          />
        )}

        {projectData.siteResaleSellingPrice
          ? (() => {
              if (projectData.isExpress && projectData.developmentPlan.type === "URBAN_PROJECT") {
                const buildingsTotalSurfaceArea = sumObjectValues(
                  projectData.developmentPlan.buildingsFloorArea,
                );

                return (
                  <DataLine
                    label={<strong>Prix de revente du site</strong>}
                    value={<strong>{formatNumberFr(projectData.siteResaleSellingPrice)} €</strong>}
                    valueTooltip={
                      buildingsTotalSurfaceArea
                        ? `Le prix de revente du site est calculé sur la base de charges foncières estimées à ${roundToInteger(projectData.siteResaleSellingPrice / buildingsTotalSurfaceArea)} €/m²SDP de bâtiment. Cette valeur est issue du retour d’expérience ADEME.`
                        : undefined
                    }
                  />
                );
              }

              return (
                <DataLine
                  label={<strong>Prix de revente du site</strong>}
                  value={<strong>{formatNumberFr(projectData.siteResaleSellingPrice)} €</strong>}
                />
              );
            })()
          : undefined}
        {projectData.buildingsResaleSellingPrice ? (
          <DataLine
            label={<strong>Prix de revente des bâtiments</strong>}
            value={<strong>{formatNumberFr(projectData.buildingsResaleSellingPrice)} €</strong>}
          />
        ) : undefined}
        {projectData.yearlyProjectedExpenses.length > 0 && (
          <>
            <DataLine
              noBorder
              label={
                <strong>
                  {projectData.developmentPlan.type === "URBAN_PROJECT"
                    ? "Dépenses annuelles d'exploitation des bâtiments"
                    : "Dépenses annuelles"}
                </strong>
              }
              value={
                <div>
                  <strong>
                    {formatNumberFr(sumListWithKey(projectData.yearlyProjectedExpenses, "amount"))}{" "}
                    €
                  </strong>
                </div>
              }
            />
            {projectData.yearlyProjectedExpenses.map(({ amount, purpose }) => {
              return (
                <DataLine
                  label={getLabelForRecurringExpense(purpose)}
                  value={`${formatNumberFr(amount)} €`}
                  isDetails
                  key={purpose}
                />
              );
            })}
          </>
        )}

        {!!projectData.financialAssistanceRevenues && (
          <>
            <DataLine
              noBorder
              label={<strong>Aides financières</strong>}
              value={
                <strong>
                  {formatNumberFr(
                    sumListWithKey(projectData.financialAssistanceRevenues, "amount"),
                  )}{" "}
                  €
                </strong>
              }
            />
            {projectData.financialAssistanceRevenues.map(({ amount, source }) => {
              return (
                <DataLine
                  label={getLabelForFinancialAssistanceRevenueSource(source)}
                  value={`${formatNumberFr(amount)} €`}
                  isDetails
                  key={source}
                />
              );
            })}
          </>
        )}
        {projectData.yearlyProjectedRevenues.length > 0 && (
          <>
            <DataLine
              noBorder
              label={
                <div>
                  <strong>Recettes annuelles</strong>
                </div>
              }
              value={
                <div>
                  <strong>
                    {formatNumberFr(sumListWithKey(projectData.yearlyProjectedRevenues, "amount"))}{" "}
                    €
                  </strong>
                </div>
              }
            />
            {projectData.yearlyProjectedRevenues.map(({ amount, source }) => {
              return (
                <DataLine
                  label={getLabelForRecurringRevenueSource(source)}
                  value={`${formatNumberFr(amount)} €`}
                  isDetails
                  key={source}
                />
              );
            })}
          </>
        )}
      </Section>
      <Section title="📆 Calendrier">
        {projectData.reinstatementSchedule && (
          <DataLine
            label={<strong>Travaux de remise en état de la friche</strong>}
            valueTooltip={
              projectData.isExpress
                ? `Bénéfriches considère que les travaux de remise en état de la friche démarrent dans 1 an et durent 1 an.`
                : undefined
            }
            value={
              <ScheduleDates
                startDateString={projectData.reinstatementSchedule.startDate}
                endDateString={projectData.reinstatementSchedule.endDate}
              />
            }
          />
        )}
        {projectData.developmentPlan.installationSchedule && (
          <DataLine
            label={<strong>Aménagement du site</strong>}
            value={
              <ScheduleDates
                startDateString={projectData.developmentPlan.installationSchedule.startDate}
                endDateString={projectData.developmentPlan.installationSchedule.endDate}
              />
            }
            valueTooltip={
              projectData.isExpress
                ? "Bénéfriches considère que les travaux d'aménagement  démarrent à l’issue des travaux de remise en état de la friche et durent 1 an."
                : undefined
            }
          />
        )}
        <DataLine
          label={<strong>Mise en service du site</strong>}
          value={projectData.firstYearOfOperation ?? "Non renseigné"}
          valueTooltip={
            projectData.isExpress
              ? "Bénéfriches considère que la mise en service du site intervient l’année suivant la fin de l’aménagement."
              : undefined
          }
        />
      </Section>
      <Section title="✍️ Dénomination">
        <DataLine label={<strong>Nom du projet</strong>} value={projectData.name} />
        {projectData.description && (
          <DataLine label={<strong>Description</strong>} value={projectData.description} />
        )}
      </Section>
    </>
  );
}
