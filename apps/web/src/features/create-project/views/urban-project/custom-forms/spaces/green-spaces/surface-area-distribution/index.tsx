import {
  greenSpacesDistributionCompleted,
  greenSpacesDistributionReverted,
} from "@/features/create-project/application/urban-project/urbanProject.actions";
import {
  selectGreenSpaces,
  selectSpaceCategorySurfaceArea,
} from "@/features/create-project/application/urban-project/urbanProject.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import UrbanGreenSpacesDistribution, { FormValues } from "./UrbanGreenSpacesDistribution";

export default function UrbanGreenSpacesDistributionContainer() {
  const dispatch = useAppDispatch();
  const greenSpaces = useAppSelector(selectGreenSpaces);
  const greenSpacesSurfaceArea = useAppSelector((state) =>
    selectSpaceCategorySurfaceArea(state, "GREEN_SPACES"),
  );

  return (
    <UrbanGreenSpacesDistribution
      greenSpaces={greenSpaces}
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
