import { requestStepCompletion } from "@/features/create-project/core/urban-project/urbanProject.actions";
import { selectStepAnswers } from "@/features/create-project/core/urban-project/urbanProject.selectors";
import SoilsDecontaminationSelection from "@/features/create-project/views/common-views/soils-decontamination/selection/SoilsDecontaminationSelection";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import { useStepBack } from "../../useStepBack";

function SoilsDecontaminationSelectionContainer() {
  const dispatch = useAppDispatch();
  const stepAnswers = useAppSelector(
    selectStepAnswers("URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION"),
  );

  const onBack = useStepBack();

  return (
    <SoilsDecontaminationSelection
      onSubmit={(formData) => {
        dispatch(
          requestStepCompletion({
            stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION",
            answers: {
              decontaminationPlan: formData.decontaminationSelection ?? "unknown",
            },
          }),
        );
      }}
      onBack={onBack}
      initialValues={{
        decontaminationSelection: stepAnswers?.decontaminationPlan ?? null,
      }}
    />
  );
}

export default SoilsDecontaminationSelectionContainer;
