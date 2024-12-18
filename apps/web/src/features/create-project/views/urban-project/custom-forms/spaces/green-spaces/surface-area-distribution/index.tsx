import {
  greenSpacesDistributionCompleted,
  greenSpacesDistributionReverted,
} from "@/features/create-project/application/urban-project/urbanProject.actions";
import { selectSpaceCategorySurfaceArea } from "@/features/create-project/application/urban-project/urbanProject.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import UrbanGreenSpacesDistribution, { FormValues } from "./UrbanGreenSpacesDistribution";

export default function UrbanGreenSpacesDistributionContainer() {
  const dispatch = useAppDispatch();
  const greenSpacesSurfaceArea = useAppSelector((state) =>
    selectSpaceCategorySurfaceArea(state, "GREEN_SPACES"),
  );

  return (
    <UrbanGreenSpacesDistribution
      totalSurfaceArea={greenSpacesSurfaceArea}
      onSubmit={(formData: FormValues) => {
        dispatch(greenSpacesDistributionCompleted({ surfaceAreaDistribution: formData }));
      }}
      onBack={() => {
        dispatch(greenSpacesDistributionReverted());
      }}
    />
  );
}
