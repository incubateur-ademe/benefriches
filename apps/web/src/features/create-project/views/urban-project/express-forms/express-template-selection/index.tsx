import { creationProjectFormSelectors } from "@/features/create-project/core/urban-project/urbanProject.selectors";
import { expressUrbanProjectCreated } from "@/features/create-project/core/urban-project/urbanProjectExpressSaved.action";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import { useStepBack } from "../useStepBack";
import UrbanProjectExpressTemplate, { FormValues } from "./UrbanProjectExpressTemplate";

function UrbanProjectExpressTemplateContainerSelection() {
  const dispatch = useAppDispatch();

  const onSubmit = (formData: FormValues) => {
    void dispatch(expressUrbanProjectCreated(formData.projectTemplate));
  };

  const onBack = useStepBack();
  const { projectTemplate } =
    useAppSelector(
      creationProjectFormSelectors.selectStepAnswers("URBAN_PROJECT_EXPRESS_TEMPLATE_SELECTION"),
    ) ?? {};

  return (
    <UrbanProjectExpressTemplate
      initialValues={projectTemplate ? { projectTemplate } : undefined}
      onSubmit={onSubmit}
      onBack={onBack}
    />
  );
}

export default UrbanProjectExpressTemplateContainerSelection;
