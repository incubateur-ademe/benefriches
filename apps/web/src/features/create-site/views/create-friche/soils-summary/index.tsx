import FricheSoilsSummary from "./FricheSoilsSummary";

import { goToNextStep } from "@/features/create-site/application/createFriche.reducer";
import { FricheSite } from "@/features/create-site/domain/friche.types";
import {
  useAppDispatch,
  useAppSelector,
} from "@/shared/views/hooks/store.hooks";
import { AppDispatch } from "@/store";

const mapProps = (dispatch: AppDispatch, fricheData: Partial<FricheSite>) => {
  return {
    onNext: () => dispatch(goToNextStep()),
    soilsSurfaceAreas: fricheData.soilsSurfaceAreas ?? {},
    totalSurfaceArea: fricheData.surfaceArea ?? 0,
  };
};

function FricheSoilsSummaryContainer() {
  const dispatch = useAppDispatch();
  const fricheData = useAppSelector((state) => state.fricheCreation.fricheData);

  return <FricheSoilsSummary {...mapProps(dispatch, fricheData)} />;
}

export default FricheSoilsSummaryContainer;
