import {
  greenSpacesDistributionCompleted,
  greenSpacesDistributionReverted,
} from "@/features/create-project/core/urban-project/actions/urbanProject.actions";
import {
  selectGreenSpacesDistribution,
  selectSpaceCategorySurfaceArea,
} from "@/features/create-project/core/urban-project/selectors/urbanProject.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import UrbanGreenSpacesDistribution, { FormValues } from "./UrbanGreenSpacesDistribution";

export default function UrbanGreenSpacesDistributionContainer() {
  const dispatch = useAppDispatch();
  const greenSpacesSurfaceArea = useAppSelector((state) =>
    selectSpaceCategorySurfaceArea(state, "GREEN_SPACES"),
  );
  const greenSpacesSurfaceAreaDistribution = useAppSelector(selectGreenSpacesDistribution);

  return (
    <UrbanGreenSpacesDistribution
      initialValues={greenSpacesSurfaceAreaDistribution.value}
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
