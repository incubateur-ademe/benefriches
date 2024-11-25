import { revertFinalSummaryStep } from "@/features/create-project/application/renewable-energy/renewableEnergy.actions";
import { selectCreationData } from "@/features/create-project/application/renewable-energy/renewableEnergy.selector";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import { saveReconversionProject } from "../../../application/renewable-energy/saveReconversionProject.action";
import ProjectionCreationDataSummary from "./ProjectCreationDataSummary";

function ProjectionCreationDataSummaryContainer() {
  const projectData = useAppSelector(selectCreationData);
  const siteData = useAppSelector((state) => state.projectCreation.siteData);

  const { current: siteSoilsCarbonStorage, projected: projectSoilsCarbonStorage } = useAppSelector(
    (state) => state.projectCreation.renewableEnergyProject.soilsCarbonStorage,
  );

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
        developmentPlanCategory: "RENEWABLE_ENERGY",
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
