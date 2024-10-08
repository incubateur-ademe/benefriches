import { getTotalSurfaceArea, typedObjectEntries } from "shared";

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
import { formatNumberFr, formatSurfaceArea } from "@/shared/services/format-number/formatNumber";
import { sumList } from "@/shared/services/sum/sum";
import classNames from "@/shared/views/clsx";
import SurfaceAreaPieChart from "@/shared/views/components/Charts/SurfaceAreaPieChart";
import DataLine from "@/shared/views/components/FeaturesList/FeaturesListDataLine";
import ScheduleDates from "@/shared/views/components/FeaturesList/FeaturesListScheduleDates";
import Section from "@/shared/views/components/FeaturesList/FeaturesListSection";
import SoilTypeLabelWithColorSquare from "@/shared/views/components/FeaturesList/FeaturesListSoilTypeLabel";

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
      <DevelopmentPlanFeatures {...projectData.developmentPlan} />
      <Section title="🌾 Transformation des sols">
        {projectData.decontaminatedSoilSurface ? (
          <DataLine
            label="Surface dépolluée"
            value={formatSurfaceArea(projectData.decontaminatedSoilSurface)}
          />
        ) : null}
        <DataLine
          noBorder
          label={<strong>Superficie totale</strong>}
          value={
            <strong>{formatSurfaceArea(getTotalSurfaceArea(projectData.soilsDistribution))}</strong>
          }
        />
        <div className="tw-grid tw-grid-cols-12">
          <div
            className={classNames(
              "tw-col-span-12",
              "md:tw-col-span-3",
              "tw-border-0",
              "tw-border-solid",
              "tw-border-l-black",
              "tw-border-l",
            )}
          >
            <SurfaceAreaPieChart
              soilsDistribution={projectData.soilsDistribution}
              customHeight="200px"
              noLabels
            />
          </div>

          <div
            className={classNames(
              "tw-col-span-12",
              "md:tw-col-span-9",
              "tw-border-0",
              "tw-border-solid",
              "tw-border-l-black",
              "tw-border-l",
              "md:tw-border-0",
              "tw-pl-2",
              "md:tw-pl-0",
            )}
          >
            {typedObjectEntries(projectData.soilsDistribution).map(([soilType, surfaceArea]) => {
              return (
                <DataLine
                  noBorder
                  label={<SoilTypeLabelWithColorSquare soilType={soilType} />}
                  value={formatSurfaceArea(surfaceArea ?? 0)}
                  key={soilType}
                  className="md:tw-grid-cols-[5fr_4fr]"
                />
              );
            })}
          </div>
        </div>
      </Section>
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
                  {formatNumberFr(sumList(projectData.reinstatementCosts.map((r) => r.amount)))} €
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
        <DataLine
          noBorder
          label={<strong>Dépenses annuelles</strong>}
          value={
            <div>
              <strong>
                {formatNumberFr(sumList(projectData.yearlyProjectedExpenses.map((e) => e.amount)))}{" "}
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
        {projectData.siteResaleTotalAmount ? (
          <DataLine
            label={<strong>Prix de revente du site et droits de mutation</strong>}
            value={<strong>{formatNumberFr(projectData.siteResaleTotalAmount)} €</strong>}
          />
        ) : undefined}
        {!!projectData.financialAssistanceRevenues && (
          <>
            <DataLine
              noBorder
              label={<strong>Aides financières</strong>}
              value={
                <strong>
                  {formatNumberFr(
                    sumList(projectData.financialAssistanceRevenues.map((r) => r.amount)),
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
                {formatNumberFr(sumList(projectData.yearlyProjectedRevenues.map((e) => e.amount)))}{" "}
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
        <DataLine
          label={<strong>Description</strong>}
          value={projectData.description || "Pas de description"}
        />
      </Section>
    </>
  );
}
