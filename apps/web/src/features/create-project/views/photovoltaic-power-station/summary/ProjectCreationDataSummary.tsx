import {
  DevelopmentPlanCategory,
  FinancialAssistanceRevenue,
  PhotovoltaicInstallationExpense,
  RecurringExpense,
  RecurringRevenue,
  ReinstatementExpense,
  SoilsDistribution,
  SoilType,
  sumListWithKey,
} from "shared";

import { SoilsCarbonStorageResult } from "@/features/create-project/application/soilsCarbonStorage.action";
import { Schedule } from "@/features/create-project/domain/project.types";
import {
  getLabelForFinancialAssistanceRevenueSource,
  getLabelForPhotovoltaicInstallationExpensePurpose,
  getLabelForRecurringExpense,
  getLabelForRecurringRevenueSource,
  getLabelForReinstatementExpensePurpose,
  RenewableEnergyDevelopmentPlanType,
} from "@/shared/domain/reconversionProject";
import { formatNumberFr, formatSurfaceArea } from "@/shared/services/format-number/formatNumber";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import SoilsCarbonStorageChart from "@/shared/views/components/Charts/SoilsCarbonStorageChart";
import SurfaceAreaPieChart from "@/shared/views/components/Charts/SurfaceAreaPieChart";
import DataLine from "@/shared/views/components/FeaturesList/FeaturesListDataLine";
import ScheduleDates from "@/shared/views/components/FeaturesList/FeaturesListScheduleDates";
import Section from "@/shared/views/components/FeaturesList/FeaturesListSection";
import SoilTypeLabelWithColorSquare from "@/shared/views/components/FeaturesList/FeaturesListSoilTypeLabel";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

import { formatCarbonStorage } from "../../common-views/soils-carbon-storage-comparison/formatCarbonStorage";
import {
  getLabelForDevelopmentPlanCategory,
  getLabelForRenewableEnergyProductionType,
} from "../../projectTypeLabelMapping";

type Props = {
  projectData: {
    name: string;
    description?: string;
    decontaminatedSurfaceArea?: number;
    developmentPlanCategory: DevelopmentPlanCategory;
    renewableEnergy: RenewableEnergyDevelopmentPlanType;
    photovoltaicElectricalPowerKWc: number;
    photovoltaicSurfaceArea: number;
    photovoltaicExpectedAnnualProduction: number;
    photovoltaicContractDuration: number;
    soilsDistribution: SoilsDistribution;
    soilsCarbonStorage?: SoilsCarbonStorageResult;
    futureOwner?: string;
    futureOperator?: string;
    projectDeveloper?: string;
    reinstatementContractOwner?: string;
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
    soilsDistribution: SoilsDistribution;
    soilsCarbonStorage?: SoilsCarbonStorageResult;
  };
  onNext: () => void;
  onBack: () => void;
};

function ProjectCreationDataSummary({ projectData, siteData, onNext, onBack }: Props) {
  return (
    <>
      <WizardFormLayout
        title="Récapitulatif du projet"
        instructions="Si des données sont erronées, vous pouvez revenir en arrière pour les modifier."
      >
        <>
          <Section title="🏗 Type de projet">
            <DataLine
              label={<strong>Type d'aménagement</strong>}
              value={getLabelForDevelopmentPlanCategory(projectData.developmentPlanCategory)}
            />
            <DataLine
              label={<strong>Type d'énergies renouvelables</strong>}
              value={getLabelForRenewableEnergyProductionType(projectData.renewableEnergy)}
            />
          </Section>
          <Section title="⚙️ Paramètres du projet">
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
              label={<strong>Durée du contrat de revente d'énergie</strong>}
              value={`${formatNumberFr(projectData.photovoltaicContractDuration)} ans`}
            />
          </Section>
          <Section title="🌾 Transformation des sols">
            {projectData.decontaminatedSurfaceArea ? (
              <DataLine
                label="Surface dépolluée"
                value={formatSurfaceArea(projectData.decontaminatedSurfaceArea)}
              />
            ) : null}
            <DataLine
              noBorder
              label={<strong>Nouvelle répartition des superficies</strong>}
              value={<strong>{formatSurfaceArea(siteData.surfaceArea)} de surface totale</strong>}
            />
            {Object.entries(projectData.soilsDistribution)
              .filter(([, surfaceArea]) => surfaceArea > 0)
              .map(([soilType, surfaceArea]) => {
                return (
                  <DataLine
                    isDetails
                    label={<SoilTypeLabelWithColorSquare soilType={soilType as SoilType} />}
                    value={formatSurfaceArea(surfaceArea)}
                    key={soilType}
                  />
                );
              })}
            <div className="tw-flex tw-gap-4 tw-justify-between tw-items-center tw-py-4">
              <div className="tw-border tw-border-solid tw-border-borderGrey tw-p-4 tw-w-[50%]">
                <h3 className="tw-uppercase tw-text-base tw-text-text-light">Site existant</h3>
                <SurfaceAreaPieChart
                  soilsDistribution={siteData.soilsDistribution}
                  noLabels
                  customHeight="250px"
                />
              </div>
              <span className="tw-text-3xl">➔</span>
              <div className="tw-border tw-border-solid tw-border-grey-dark tw-p-4 tw-w-[50%]">
                <h3 className="tw-uppercase tw-text-base">Site avec projet</h3>
                <SurfaceAreaPieChart
                  soilsDistribution={projectData.soilsDistribution}
                  noLabels
                  customHeight="250px"
                />
              </div>
            </div>

            {siteData.soilsCarbonStorage && projectData.soilsCarbonStorage ? (
              <>
                <DataLine
                  label={<strong>Stockage du carbone dans les sols après transformation</strong>}
                  value={
                    <strong>
                      {formatCarbonStorage(
                        projectData.soilsCarbonStorage.totalCarbonStorage -
                          siteData.soilsCarbonStorage.totalCarbonStorage,
                      )}{" "}
                      T de carbone stocké
                    </strong>
                  }
                />
                {projectData.soilsCarbonStorage.soilsStorage.map(({ type, carbonStorage }) => {
                  return (
                    <DataLine
                      label={<SoilTypeLabelWithColorSquare soilType={type} />}
                      value={`${formatCarbonStorage(carbonStorage)} T`}
                      key={type}
                    />
                  );
                })}
                <div className="tw-flex tw-gap-4 tw-justify-between tw-items-center tw-py-4">
                  <div className="tw-border tw-border-solid tw-border-borderGrey tw-p-4 tw-w-[50%]">
                    <h3 className="tw-uppercase tw-text-base tw-text-text-light">Site existant</h3>
                    <SoilsCarbonStorageChart
                      soilsCarbonStorage={siteData.soilsCarbonStorage.soilsStorage}
                      noLabels
                      customHeight="250px"
                    />
                  </div>
                  <span className="tw-text-3xl">➔</span>
                  <div className="tw-border tw-border-solid tw-border-grey-dark tw-p-4 tw-w-[50%]">
                    <h3 className="tw-uppercase tw-text-base">Site avec projet</h3>
                    <SoilsCarbonStorageChart
                      soilsCarbonStorage={projectData.soilsCarbonStorage.soilsStorage}
                      noLabels
                      customHeight="250px"
                    />
                  </div>
                </div>
              </>
            ) : null}
          </Section>
          <Section title="👱 Acteurs">
            <DataLine
              label={<strong>Aménageur du site</strong>}
              value={projectData.projectDeveloper ?? "Non renseigné"}
            />
            <DataLine
              label={<strong>Futur propriétaire du site</strong>}
              value={projectData.futureOwner ?? "Pas de changement de propriétaire"}
            />
            {projectData.futureOperator && (
              <DataLine
                label={<strong>Futur exploitant</strong>}
                value={projectData.futureOperator}
              />
            )}
            {projectData.reinstatementContractOwner && (
              <DataLine
                label={<strong>Maître d'ouvrage des travaux de remise en état de la friche</strong>}
                value={projectData.reinstatementContractOwner}
              />
            )}
          </Section>
          <Section title="💰 Dépenses et recettes du projet">
            {projectData.sitePurchaseTotalCost ? (
              <DataLine
                label={<strong>Prix de vente du site et droits de mutation</strong>}
                value={<strong>{formatNumberFr(projectData.sitePurchaseTotalCost)} €</strong>}
              />
            ) : undefined}
            {!!projectData.reinstatementExpenses && (
              <>
                <DataLine
                  noBorder
                  label={<strong>Dépenses de remise en état de la friche</strong>}
                  value={
                    <strong>
                      {formatNumberFr(sumListWithKey(projectData.reinstatementExpenses, "amount"))}{" "}
                      €
                    </strong>
                  }
                />
                {projectData.reinstatementExpenses.map(({ amount, purpose }) => {
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
            {projectData.photovoltaicPanelsInstallationExpenses &&
              projectData.photovoltaicPanelsInstallationExpenses.length > 0 && (
                <>
                  <DataLine
                    noBorder
                    label={<strong>Dépenses d'installation de la centrale photovoltaïque</strong>}
                    value={
                      <strong>
                        {formatNumberFr(
                          sumListWithKey(
                            projectData.photovoltaicPanelsInstallationExpenses,
                            "amount",
                          ),
                        )}{" "}
                        €
                      </strong>
                    }
                  />
                  {projectData.photovoltaicPanelsInstallationExpenses.map(({ amount, purpose }) => (
                    <DataLine
                      label={getLabelForPhotovoltaicInstallationExpensePurpose(purpose)}
                      value={`${formatNumberFr(amount)} €`}
                      isDetails
                      key={purpose}
                    />
                  ))}
                </>
              )}
            <DataLine
              noBorder
              label={<strong>Dépenses annuelles</strong>}
              value={
                <strong>
                  {formatNumberFr(sumListWithKey(projectData.yearlyProjectedExpenses, "amount"))} €
                </strong>
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
          </Section>
          <Section title="✍️ Dénomination">
            <DataLine label={<strong>Nom du projet</strong>} value={projectData.name} />
            {projectData.description && (
              <DataLine label={<strong>Description</strong>} value={projectData.description} />
            )}
          </Section>
        </>
        <div className="tw-mt-8">
          <BackNextButtonsGroup onBack={onBack} onNext={onNext} nextLabel="Valider" />
        </div>
      </WizardFormLayout>
    </>
  );
}

export default ProjectCreationDataSummary;
