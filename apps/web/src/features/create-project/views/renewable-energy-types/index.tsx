import RenewableEnergyTypeForm from "./RenewableEnergyTypeForm";

import { completeRenewableEnergyDevelopmentPlanType } from "@/features/create-project/application/createProject.reducer";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

function ProjectRenewableEnergyTypesFormContainer() {
  const dispatch = useAppDispatch();
  const siteSurfaceArea = useAppSelector(
    (state) => state.projectCreation.siteData?.surfaceArea ?? 0,
  );
  return (
    <RenewableEnergyTypeForm
      siteSurfaceArea={siteSurfaceArea}
      onSubmit={(data) => {
        dispatch(completeRenewableEnergyDevelopmentPlanType(data.renewableEnergyTypes));
      }}
    />
  );
}

export default ProjectRenewableEnergyTypesFormContainer;
