import NaturalAndAgriculturalSoilsForm, {
  FormValues,
} from "./NaturalAndAgriculturalSoilsForm";

import { addSoils } from "@/features/create-site/application/createFriche.reducer";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";
import { AppDispatch } from "@/store";

const mapProps = (dispatch: AppDispatch) => {
  return {
    onSubmit: (formData: FormValues) => {
      console.log(formData);
      dispatch(addSoils(formData.soils));
    },
  };
};

const NaturalAndAgriculturalSoilsFormContainer = () => {
  const dispatch = useAppDispatch();

  return <NaturalAndAgriculturalSoilsForm {...mapProps(dispatch)} />;
};

export default NaturalAndAgriculturalSoilsFormContainer;
