import { requestStepCompletion } from "@/features/create-project/core/urban-project-beta/urbanProject.actions";
import { selectStepAnswers } from "@/features/create-project/core/urban-project-beta/urbanProject.selectors";
import { expressUrbanProjectSaved } from "@/features/create-project/core/urban-project-beta/urbanProjectExpressSaved.action";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import { useStepBack } from "../../custom-forms/useStepBack";
import UrbanProjectExpressCategory, { FormValues } from "./UrbanProjectExpressCategory";

function UrbanProjectExpressCategoryContainer() {
  const dispatch = useAppDispatch();

  const onSubmit = (formData: FormValues) => {
    void dispatch(expressUrbanProjectSaved(formData.expressCategory));
    void dispatch(
      requestStepCompletion({
        stepId: "URBAN_PROJECT_EXPRESS_CATEGORY_SELECTION",
        answers: { expressCategory: formData.expressCategory },
      }),
    );
  };

  const onBack = useStepBack();
  const { expressCategory } =
    useAppSelector(selectStepAnswers("URBAN_PROJECT_EXPRESS_CATEGORY_SELECTION")) ?? {};

  return (
    <UrbanProjectExpressCategory
      initialValues={expressCategory ? { expressCategory } : undefined}
      onSubmit={onSubmit}
      onBack={onBack}
    />
  );
}

export default UrbanProjectExpressCategoryContainer;
