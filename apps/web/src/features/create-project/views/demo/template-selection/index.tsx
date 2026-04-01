import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { selectDemoProjectTemplateViewData } from "@/features/create-project/core/demo/demoProject.selectors";
import { demoProjectCreated } from "@/features/create-project/core/demo/demoProjectSaved.action";

import { useStepBack } from "../useStepBack";
import DemoProjectTemplate, { FormValues } from "./DemoProjectTemplate";

function DemoProjectTemplateContainerSelection() {
  const dispatch = useAppDispatch();

  const onSubmit = (formData: FormValues) => {
    void dispatch(demoProjectCreated(formData.projectTemplate));
  };

  const onBack = useStepBack();
  const { projectTemplate, hasStepBack } = useAppSelector(selectDemoProjectTemplateViewData);

  return (
    <DemoProjectTemplate
      initialValues={projectTemplate ? { projectTemplate } : undefined}
      onSubmit={onSubmit}
      onBack={hasStepBack ? onBack : undefined}
    />
  );
}

export default DemoProjectTemplateContainerSelection;
