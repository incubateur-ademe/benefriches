import { revertFinalSummaryStep } from "../../application/createProject.reducer";
import { saveReconversionProject } from "../../application/saveReconversionProject.action";
import { SoilsCarbonStorageResult } from "../../application/soilsCarbonStorage.actions";
import ProjectionCreationDataSummary from "./ProjectCreationDataSummary";

import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

function ProjectionCreationDataSummaryContainer() {
  const projectData = useAppSelector((state) => state.projectCreation.projectData);
  const siteData = useAppSelector((state) => state.projectCreation.siteData);

  const { current: siteSoilsCarbonStorage, projected: projectSoilsCarbonStorage } = useAppSelector(
    (state) => state.projectSoilsCarbonStorage,
  ) as { current?: SoilsCarbonStorageResult; projected?: SoilsCarbonStorageResult };

  const dispatch = useAppDispatch();

  const onNext = () => {
    void dispatch(saveReconversionProject());
  };

  const onBack = () => {
    dispatch(revertFinalSummaryStep());
  };

  return (
    <ProjectionCreationDataSummary
      onNext={onNext}
      onBack={onBack}
      projectData={{
        name: projectData.name ?? "",
        description: projectData.description,
        developmentPlanCategory: projectData.developmentPlanCategory!,
        renewableEnergy: projectData.renewableEnergyType!,
        photovoltaicElectricalPowerKWc: projectData.photovoltaicInstallationElectricalPowerKWc ?? 0,
        photovoltaicSurfaceArea: projectData.photovoltaicInstallationSurfaceSquareMeters ?? 0,
        photovoltaicExpectedAnnualProduction: projectData.photovoltaicExpectedAnnualProduction ?? 0,
        photovoltaicContractDuration: projectData.photovoltaicContractDuration ?? 0,
        soilsDistribution: projectData.soilsDistribution ?? {},
        soilsCarbonStorage: projectSoilsCarbonStorage,
        projectDeveloper: projectData.projectDeveloper?.name,
        futureOwner: projectData.futureSiteOwner?.name,
        futureOperator: projectData.futureOperator?.name,
        reinstatementContractOwner: projectData.reinstatementContractOwner?.name,
        reinstatementFullTimeJobs: projectData.reinstatementFullTimeJobsInvolved,
        conversionFullTimeJobs: projectData.conversionFullTimeJobsInvolved,
        operationsFullTimeJobs: projectData.operationsFullTimeJobsInvolved,
        sitePurchaseTotalCost: projectData.sitePurchaseSellingPrice
          ? projectData.sitePurchaseSellingPrice +
            (projectData.sitePurchasePropertyTransferDuties ?? 0)
          : 0,
        financialAssistanceRevenues: projectData.financialAssistanceRevenues,
        reinstatementExpenses: projectData.reinstatementExpenses ?? [],
        photovoltaicPanelsInstallationExpenses: projectData.photovoltaicPanelsInstallationExpenses,
        yearlyProjectedExpenses: projectData.yearlyProjectedExpenses ?? [],
        yearlyProjectedRevenues: projectData.yearlyProjectedRevenues ?? [],
        reinstatementSchedule: projectData.reinstatementSchedule,
        photovoltaticInstallationSchedule: projectData.photovoltaicInstallationSchedule,
        decontaminatedSurfaceArea: projectData.decontaminatedSurfaceArea,
        firstYearOfOperation: projectData.firstYearOfOperation,
      }}
      siteData={{
        surfaceArea: siteData?.surfaceArea ?? 0,
        isFriche: siteData?.isFriche ?? false,
        soilsDistribution: siteData?.soilsDistribution ?? {},
        soilsCarbonStorage: siteSoilsCarbonStorage,
      }}
    />
  );
}

export default ProjectionCreationDataSummaryContainer;
