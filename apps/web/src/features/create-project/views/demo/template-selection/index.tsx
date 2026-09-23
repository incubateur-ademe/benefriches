import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { demoProjectCreated } from "@/features/create-project/core/demo/demoProject.actions";
import { selectDemoProjectTemplateViewData } from "@/features/create-project/core/demo/demoProject.selectors";

import { useStepBack } from "../useStepBack";
import type { FormValues } from "./DemoProjectTemplate";
import DemoProjectTemplate from "./DemoProjectTemplate";

function DemoProjectTemplateContainerSelection() {
  const dispatch = useAppDispatch();

  const onSubmit = (formData: FormValues) => {
    void dispatch(demoProjectCreated(formData.projectTemplate));
  };

  const onBack = useStepBack();
  const { projectTemplate, hasStepBack, projectSuggestions } = useAppSelector(
    selectDemoProjectTemplateViewData,
  );

  return (
    <DemoProjectTemplate
      initialValues={projectTemplate ? { projectTemplate } : undefined}
      onSubmit={onSubmit}
      onBack={hasStepBack ? onBack : undefined}
      projectSuggestions={projectSuggestions}
    />
  );
}

export default DemoProjectTemplateContainerSelection;
