import { sumListWithKey } from "shared";

import {
  getLabelForDevelopmentPlanCategory,
  getLabelForRenewableEnergyProductionType,
} from "@/features/create-project/views/projectTypeLabelMapping";
import { ProjectFeatures } from "@/features/projects/domain/projects.types";
import {
  getLabelForFinancialAssistanceRevenueSource,
  getLabelForRecurringExpense,
  getLabelForRecurringRevenueSource,
  getLabelForReinstatementExpensePurpose,
} from "@/shared/domain/reconversionProject";
import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import DataLine from "@/shared/views/components/FeaturesList/FeaturesListDataLine";
import ScheduleDates from "@/shared/views/components/FeaturesList/FeaturesListScheduleDates";
import Section from "@/shared/views/components/FeaturesList/FeaturesListSection";

import DevelopmentPlanFeatures from "./DevelopmentPlanFeatures";
import DevelopmentPlanInstallationExpenses from "./DevelopmentPlanInstallationExpenses";

type Props = {
  projectData: ProjectFeatures;
};

export default function ProjectFeaturesView({ projectData }: Props) {
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

      <Section title="👱 Acteurs">
        <DataLine
          label={<strong>Aménageur du site</strong>}
          value={projectData.developmentPlan.developerName ?? "Non renseigné"}
        />
        <DataLine
          label={<strong>Futur propriétaire du site</strong>}
          value={projectData.futureOwner ?? "Pas de changement de propriétaire"}
        />
        {projectData.futureOperator && (
          <DataLine label={<strong>Futur exploitant</strong>} value={projectData.futureOperator} />
        )}
        {projectData.reinstatementContractOwner && (
          <DataLine
            label={<strong>Maître d'ouvrage des travaux de remise en état de la friche</strong>}
            value={projectData.reinstatementContractOwner}
          />
        )}
        <DataLine
          noBorder
          label={<strong>Emplois équivalent temps plein mobilisés</strong>}
          value={formatNumberFr(
            (projectData.reinstatementFullTimeJobs ?? 0) +
              (projectData.conversionFullTimeJobs ?? 0) +
              (projectData.operationsFullTimeJobs ?? 0),
          )}
        />
        {projectData.reinstatementFullTimeJobs ? (
          <DataLine
            label="Remise en état de la friche"
            value={formatNumberFr(projectData.reinstatementFullTimeJobs)}
            isDetails
          />
        ) : null}
        {projectData.conversionFullTimeJobs ? (
          <DataLine
            label="Installation des panneaux photovoltaïques"
            value={
              projectData.conversionFullTimeJobs
                ? formatNumberFr(projectData.conversionFullTimeJobs)
                : "Non renseigné"
            }
            isDetails
          />
        ) : null}
        <DataLine
          label="Exploitation du site reconverti"
          value={
            projectData.operationsFullTimeJobs
              ? formatNumberFr(projectData.operationsFullTimeJobs)
              : "Non renseigné"
          }
          isDetails
        />
      </Section>
      <Section title="💰 Dépenses et recettes du projet">
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

        {projectData.siteResaleTotalAmount ? (
          <DataLine
            label={<strong>Prix de revente du site et droits de mutation</strong>}
            value={<strong>{formatNumberFr(projectData.siteResaleTotalAmount)} €</strong>}
          />
        ) : undefined}
        {projectData.yearlyProjectedExpenses.length > 0 && (
          <>
            <DataLine
              noBorder
              label={<strong>Dépenses annuelles</strong>}
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
            label={<strong>Travaux d'aménagement</strong>}
            value={
              <ScheduleDates
                startDateString={projectData.developmentPlan.installationSchedule.startDate}
                endDateString={projectData.developmentPlan.installationSchedule.endDate}
              />
            }
          />
        )}
        <DataLine
          label={<strong>Mise en service du site</strong>}
          value={projectData.firstYearOfOperation ?? "Non renseigné"}
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
