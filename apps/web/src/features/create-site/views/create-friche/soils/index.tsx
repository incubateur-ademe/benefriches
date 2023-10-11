import FricheSoilsForm, {
  FormValues,
  NATURAL_OR_AGRICULTURAL_SOILS,
} from "./FricheSoilsForm";

import { setSoils } from "@/features/create-site/application/createFriche.reducer";
import { FricheSoilType } from "@/features/create-site/domain/friche.types";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";
import { AppDispatch } from "@/store";

const mapProps = (dispatch: AppDispatch) => {
  return {
    onSubmit: (formData: FormValues) => {
      const hasNaturalOrAgriculturalSoils = formData.soils.includes(
        NATURAL_OR_AGRICULTURAL_SOILS,
      );
      const soils = formData.soils.filter(
        (soilType) => soilType !== NATURAL_OR_AGRICULTURAL_SOILS,
      ) as FricheSoilType[];
      dispatch(setSoils({ hasNaturalOrAgriculturalSoils, soils }));
    },
  };
};

const FricheSoilsFormContainer = () => {
  const dispatch = useAppDispatch();

  return <FricheSoilsForm {...mapProps(dispatch)} />;
};

export default FricheSoilsFormContainer;
