import { stepRevertAttempted } from "@/features/create-project/core/actions/actionsUtils";
import { expressUrbanProjectSaved } from "@/features/create-project/core/urban-project/actions/expressUrbanProjectSaved.action";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

import UrbanProjectExpressCategory, { FormValues } from "./UrbanProjectExpressCategory";

function UrbanProjectExpressCategoryContainer() {
  const dispatch = useAppDispatch();

  const onBack = () => {
    dispatch(stepRevertAttempted());
  };

  const onSubmit = (formData: FormValues) => {
    void dispatch(expressUrbanProjectSaved(formData.expressCategory));
  };

  return <UrbanProjectExpressCategory onSubmit={onSubmit} onBack={onBack} />;
}

export default UrbanProjectExpressCategoryContainer;
