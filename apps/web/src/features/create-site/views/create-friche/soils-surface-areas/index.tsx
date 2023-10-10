import FricheSoilsSurfaceAreasForm, {
  type FormValues,
} from "./FricheSoilsSurfaceAreasForm";

import { setSoilsSurfaceAreas } from "@/features/create-site/application/createFriche.reducers";
import { FricheSite } from "@/features/create-site/domain/friche.types";
import {
  useAppDispatch,
  useAppSelector,
} from "@/shared/views/hooks/store.hooks";
import { AppDispatch } from "@/store";

const mapProps = (dispatch: AppDispatch, fricheData: Partial<FricheSite>) => {
  return {
    onSubmit: (formData: FormValues) =>
      dispatch(setSoilsSurfaceAreas(formData)),
    soils: fricheData.soils ?? [],
    totalSurfaceArea: fricheData.surfaceArea ?? 0,
  };
};

function FricheSoilsSurfaceAreasFormContainer() {
  const dispatch = useAppDispatch();
  const fricheData = useAppSelector((state) => state.fricheCreation.fricheData);

  return <FricheSoilsSurfaceAreasForm {...mapProps(dispatch, fricheData)} />;
}

export default FricheSoilsSurfaceAreasFormContainer;
