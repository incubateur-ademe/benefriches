import {
  expressCategorySelected,
  expressCategoryStepReverted,
} from "@/features/create-project/application/urban-project/urbanProject.actions";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

import UrbanProjectExpressCategory, { FormValues } from "./UrbanProjectExpressCategory";

function UrbanProjectExpressCategoryContainer() {
  const dispatch = useAppDispatch();

  const onBack = () => {
    dispatch(expressCategoryStepReverted());
  };

  const onSubmit = (formData: FormValues) => {
    void dispatch(expressCategorySelected(formData.expressCategory));
  };

  return <UrbanProjectExpressCategory onSubmit={onSubmit} onBack={onBack} />;
}

export default UrbanProjectExpressCategoryContainer;
