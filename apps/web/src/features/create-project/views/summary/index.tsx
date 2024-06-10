import { revertFinalSummaryStep } from "../../application/createProject.reducer";
import { saveReconversionProject } from "../../application/saveReconversionProject.action";
import ProjectionCreationDataSummary from "./ProjectCreationDataSummary";

import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

function ProjectionCreationDataSummaryContainer() {
  const projectData = useAppSelector((state) => state.projectCreation.projectData);
  const siteData = useAppSelector((state) => state.projectCreation.siteData);
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
        developmentPlanCategory: projectData.developmentPlanCategories![0]!,
        renewableEnergy: projectData.renewableEnergyTypes![0]!,
        photovoltaicElectricalPowerKWc: projectData.photovoltaicInstallationElectricalPowerKWc ?? 0,
        photovoltaicSurfaceArea: projectData.photovoltaicInstallationSurfaceSquareMeters ?? 0,
        photovoltaicExpectedAnnualProduction: projectData.photovoltaicExpectedAnnualProduction ?? 0,
        photovoltaicContractDuration: projectData.photovoltaicContractDuration ?? 0,
        soilsDistribution: projectData.soilsDistribution ?? {},
        projectDeveloper: projectData.projectDeveloper?.name,
        futureOwner: projectData.futureSiteOwner?.name,
        futureOperator: projectData.futureOperator?.name,
        reinstatementContractOwner: projectData.reinstatementContractOwner?.name,
        reinstatementFullTimeJobs: projectData.reinstatementFullTimeJobsInvolved,
        conversionFullTimeJobs: projectData.conversionFullTimeJobsInvolved,
        operationsFullTimeJobs: projectData.operationsFullTimeJobsInvolved,
        realEstateTransactionTotalCost: projectData.realEstateTransactionSellingPrice
          ? projectData.realEstateTransactionSellingPrice +
            (projectData.realEstateTransactionPropertyTransferDuties ?? 0)
          : 0,
        finanalAssistanceRevenues: projectData.financialAssistanceRevenues,
        reinstatementCost: projectData.reinstatementCosts?.total,
        photovoltaicPanelsInstallationCosts: projectData.photovoltaicPanelsInstallationCosts,
        yearlyProjectedCosts: projectData.yearlyProjectedCosts ?? [],
        yearlyProjectedRevenues: projectData.yearlyProjectedRevenues ?? [],
        reinstatementSchedule: projectData.reinstatementSchedule,
        photovoltaticInstallationSchedule: projectData.photovoltaicInstallationSchedule,

        firstYearOfOperation: projectData.firstYearOfOperation,
      }}
      siteData={{
        surfaceArea: siteData?.surfaceArea ?? 0,
        isFriche: siteData?.isFriche ?? false,
      }}
    />
  );
}

export default ProjectionCreationDataSummaryContainer;
