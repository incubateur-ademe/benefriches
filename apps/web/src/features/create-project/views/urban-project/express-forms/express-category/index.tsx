import { expressUrbanProjectSaved } from "@/features/create-project/core/urban-project/actions/expressUrbanProjectSaved.action";
import { expressCategoryStepReverted } from "@/features/create-project/core/urban-project/actions/urbanProject.actions";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

import UrbanProjectExpressCategory, { FormValues } from "./UrbanProjectExpressCategory";

function UrbanProjectExpressCategoryContainer() {
  const dispatch = useAppDispatch();

  const onBack = () => {
    dispatch(expressCategoryStepReverted());
  };

  const onSubmit = (formData: FormValues) => {
    void dispatch(expressUrbanProjectSaved(formData.expressCategory));
  };

  return <UrbanProjectExpressCategory onSubmit={onSubmit} onBack={onBack} />;
}

export default UrbanProjectExpressCategoryContainer;
