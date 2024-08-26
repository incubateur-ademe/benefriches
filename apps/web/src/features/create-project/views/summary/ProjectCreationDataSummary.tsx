import { ReactNode } from "react";
import Accordion from "@codegouvfr/react-dsfr/Accordion";
import {
  DevelopmentPlanCategory,
  FinancialAssistanceRevenue,
  PhotovoltaicInstallationExpense,
  RecurringExpense,
  RecurringRevenue,
  ReinstatementExpense,
  SoilsDistribution,
  SoilType,
} from "shared";
import { Schedule } from "../../application/saveReconversionProject.action";
import {
  getLabelForDevelopmentPlanCategory,
  getLabelForRenewableEnergyProductionType,
} from "../projectTypeLabelMapping";

import {
  getLabelForFinancialAssistanceRevenueSource,
  getLabelForPhotovoltaicInstallationExpensePurpose,
  getLabelForRecurringExpense,
  getLabelForRecurringRevenueSource,
  getLabelForReinstatementExpensePurpose,
  RenewableEnergyDevelopmentPlanType,
} from "@/shared/domain/reconversionProject";
import { formatNumberFr, formatSurfaceArea } from "@/shared/services/format-number/formatNumber";
import { getLabelForSoilType } from "@/shared/services/label-mapping/soilTypeLabelMapping";
import { sumList } from "@/shared/services/sum/sum";
import classNames from "@/shared/views/clsx";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  projectData: {
    name: string;
    description?: string;
    developmentPlanCategory: DevelopmentPlanCategory;
    renewableEnergy: RenewableEnergyDevelopmentPlanType;
    photovoltaicElectricalPowerKWc: number;
    photovoltaicSurfaceArea: number;
    photovoltaicExpectedAnnualProduction: number;
    photovoltaicContractDuration: number;
    soilsDistribution: SoilsDistribution;
    futureOwner?: string;
    futureOperator?: string;
    projectDeveloper?: string;
    reinstatementContractOwner?: string;
    reinstatementFullTimeJobs?: number;
    conversionFullTimeJobs?: number;
    operationsFullTimeJobs?: number;
    sitePurchaseTotalCost?: number;
    financialAssistanceRevenues?: FinancialAssistanceRevenue[];
    reinstatementExpenses?: ReinstatementExpense[];
    photovoltaicPanelsInstallationExpenses?: PhotovoltaicInstallationExpense[];
    yearlyProjectedExpenses: RecurringExpense[];
    yearlyProjectedRevenues: RecurringRevenue[];
    reinstatementSchedule?: Schedule;
    photovoltaticInstallationSchedule?: Schedule;
    firstYearOfOperation?: number;
  };
  siteData: {
    surfaceArea: number;
    isFriche: boolean;
  };
  onNext: () => void;
  onBack: () => void;
};

type DataLineProps = {
  label: ReactNode;
  value: ReactNode;
  className?: string;
};
function DataLine({ label, value, className = "" }: DataLineProps) {
  const classes = `fr-my-2w  ${className}`;
  return (
    <dl className={classNames(classes, "tw-flex", "tw-justify-between")}>
      <dd className="fr-p-0">{label}</dd>
      <dt className="tw-text-right">{value}</dt>
    </dl>
  );
}

type ScheduleDatesProps = {
  startDateString: string;
  endDateString: string;
};
function ScheduleDates({ startDateString, endDateString }: ScheduleDatesProps) {
  const startDate = new Date(startDateString);
  const endDate = new Date(endDateString);
  return (
    <span>
      {startDate.toLocaleDateString()} ➡️ {endDate.toLocaleDateString()}
    </span>
  );
}

function ProjectCreationDataSummary({ projectData, siteData, onNext, onBack }: Props) {
  return (
    <>
      <WizardFormLayout
        title="Récapitulatif du projet"
        instructions="Si des données sont erronées, vous pouvez revenir en arrière pour les modifier."
      >
        <Accordion label="Type de projet" defaultExpanded>
          <DataLine
            label={<strong>Type d'aménagement</strong>}
            value={getLabelForDevelopmentPlanCategory(projectData.developmentPlanCategory)}
          />
          <DataLine
            label={<strong>Type d'énergies renouvelables</strong>}
            value={getLabelForRenewableEnergyProductionType(projectData.renewableEnergy)}
          />
        </Accordion>
        <Accordion label="Panneaux photovoltaïques" defaultExpanded>
          <DataLine
            label={<strong>Puissance d'installation</strong>}
            value={`${formatNumberFr(projectData.photovoltaicElectricalPowerKWc)} kWc`}
          />
          <DataLine
            label={<strong>Superficie occupée par les panneaux</strong>}
            value={formatSurfaceArea(projectData.photovoltaicSurfaceArea)}
          />
          <DataLine
            label={<strong>Production annuelle attendue</strong>}
            value={`${formatNumberFr(projectData.photovoltaicExpectedAnnualProduction)} MWh / an`}
          />
          <DataLine
            label={<strong>Durée du contrat de revente de l'énergie</strong>}
            value={`${formatNumberFr(projectData.photovoltaicContractDuration)} ans`}
          />
        </Accordion>
        <Accordion label="Transformation des sols" defaultExpanded>
          <DataLine
            label={<strong>Superficie totale du site</strong>}
            value={<strong>{formatSurfaceArea(siteData.surfaceArea)}</strong>}
            className="fr-mb-1w"
          />
          {Object.entries(projectData.soilsDistribution)
            .filter(([, surfaceArea]) => surfaceArea > 0)
            .map(([soilType, surfaceArea]) => {
              return (
                <DataLine
                  label={getLabelForSoilType(soilType as SoilType)}
                  value={formatSurfaceArea(surfaceArea)}
                  key={soilType}
                  className="fr-ml-2w"
                />
              );
            })}
        </Accordion>
        <Accordion label="Acteurs" defaultExpanded>
          <DataLine
            label={<strong>Aménageur du site</strong>}
            value={projectData.projectDeveloper}
          />
          <DataLine
            label={<strong>Futur propriétaire du site</strong>}
            value={projectData.futureOwner ?? "Pas de changement de propriétaire"}
          />
          <DataLine label={<strong>Futur exploitant</strong>} value={projectData.futureOperator} />
          {projectData.reinstatementContractOwner && (
            <DataLine
              label={<strong>Maître d'ouvrage des travaux de remise en état de la friche</strong>}
              value={projectData.reinstatementContractOwner}
            />
          )}
          <strong className="fr-ml-2w">Emplois équivalent temps plein mobilisés</strong>
          {projectData.reinstatementFullTimeJobs && (
            <DataLine
              label="Remise en état de la friche"
              value={formatNumberFr(projectData.reinstatementFullTimeJobs)}
              className="fr-ml-2w"
            />
          )}
          {projectData.conversionFullTimeJobs && (
            <DataLine
              label="Installation des panneaux photovoltaïques"
              value={
                projectData.conversionFullTimeJobs
                  ? formatNumberFr(projectData.conversionFullTimeJobs)
                  : "Non renseigné"
              }
              className="fr-ml-2w"
            />
          )}
          <DataLine
            label="Exploitation du site reconverti"
            value={
              projectData.operationsFullTimeJobs
                ? formatNumberFr(projectData.operationsFullTimeJobs)
                : "Non renseigné"
            }
            className="fr-ml-2w"
          />
        </Accordion>
        <Accordion label="Dépenses et recettes du projet" defaultExpanded>
          {projectData.sitePurchaseTotalCost ? (
            <DataLine
              label={<strong>Prix de vente du site et droits de mutation</strong>}
              value={`${formatNumberFr(projectData.sitePurchaseTotalCost)} €`}
            />
          ) : undefined}
          {!!projectData.financialAssistanceRevenues && (
            <>
              <DataLine
                label={<strong>Aides financières</strong>}
                value={
                  <strong>
                    {formatNumberFr(
                      sumList(projectData.financialAssistanceRevenues.map((r) => r.amount)),
                    )}{" "}
                    €
                  </strong>
                }
                className="fr-mb-1w fr-mt-2w"
              />
              {projectData.financialAssistanceRevenues.map(({ amount, source }) => {
                return (
                  <DataLine
                    label={getLabelForFinancialAssistanceRevenueSource(source)}
                    value={`${formatNumberFr(amount)} €`}
                    className="fr-ml-2w"
                    key={source}
                  />
                );
              })}
            </>
          )}
          {!!projectData.reinstatementExpenses && (
            <>
              <DataLine
                label={<strong>Dépenses de remise en état de la friche</strong>}
                value={
                  <strong>
                    {formatNumberFr(
                      sumList(projectData.reinstatementExpenses.map((r) => r.amount)),
                    )}{" "}
                    €
                  </strong>
                }
                className="fr-mb-1w fr-mt-2w"
              />
              {projectData.reinstatementExpenses.map(({ amount, purpose }) => {
                return (
                  <DataLine
                    label={getLabelForReinstatementExpensePurpose(purpose)}
                    value={`${formatNumberFr(amount)} €`}
                    className="fr-ml-2w"
                    key={purpose}
                  />
                );
              })}
            </>
          )}
          {!!projectData.photovoltaicPanelsInstallationExpenses && (
            <>
              <DataLine
                label={<strong>Dépenses d’installation de la centrale photovoltaïque</strong>}
                value={
                  <strong>
                    {formatNumberFr(
                      sumList(
                        projectData.photovoltaicPanelsInstallationExpenses.map((r) => r.amount),
                      ),
                    )}{" "}
                    €
                  </strong>
                }
                className="fr-mb-1w fr-mt-2w"
              />
              {projectData.photovoltaicPanelsInstallationExpenses.map(({ amount, purpose }) => {
                return (
                  <DataLine
                    label={getLabelForPhotovoltaicInstallationExpensePurpose(purpose)}
                    value={`${formatNumberFr(amount)} €`}
                    className="fr-ml-2w"
                    key={purpose}
                  />
                );
              })}
            </>
          )}
          <DataLine
            label={<strong>Dépenses annuelles</strong>}
            value={
              <strong>
                {formatNumberFr(sumList(projectData.yearlyProjectedExpenses.map((e) => e.amount)))}{" "}
                €
              </strong>
            }
            className="fr-mb-1w fr-mt-2w"
          />
          {projectData.yearlyProjectedExpenses.map(({ amount, purpose }) => {
            return (
              <DataLine
                label={getLabelForRecurringExpense(purpose)}
                value={`${formatNumberFr(amount)} €`}
                className="fr-ml-2w"
                key={purpose}
              />
            );
          })}
          <DataLine
            label={<strong>Recettes annuelles</strong>}
            value={
              <strong>
                {formatNumberFr(sumList(projectData.yearlyProjectedRevenues.map((e) => e.amount)))}{" "}
                €
              </strong>
            }
            className="fr-mb-1w fr-mt-2w"
          />
          {projectData.yearlyProjectedRevenues.map(({ amount, source }) => {
            return (
              <DataLine
                label={getLabelForRecurringRevenueSource(source)}
                value={`${formatNumberFr(amount)} €`}
                className="fr-ml-2w"
                key={source}
              />
            );
          })}
        </Accordion>
        <Accordion label="Calendrier" defaultExpanded>
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
          {projectData.photovoltaticInstallationSchedule && (
            <DataLine
              label={<strong>Travaux d'installation des panneaux</strong>}
              value={
                <ScheduleDates
                  startDateString={projectData.photovoltaticInstallationSchedule.startDate}
                  endDateString={projectData.photovoltaticInstallationSchedule.endDate}
                />
              }
            />
          )}
          <DataLine
            label={<strong>Mise en service du site</strong>}
            value={projectData.firstYearOfOperation ?? "Non renseigné"}
          />
        </Accordion>
        <Accordion label="Dénomination" defaultExpanded>
          <DataLine label={<strong>Nom du projet</strong>} value={projectData.name} />
          <DataLine
            label={<strong>Description</strong>}
            value={projectData.description || "Pas de description"}
          />
        </Accordion>
        <div className="fr-mt-4w">
          <BackNextButtonsGroup onBack={onBack} onNext={onNext} />
        </div>
      </WizardFormLayout>
    </>
  );
}

export default ProjectCreationDataSummary;
