import {
  livingAndActivitySpacesDistributionCompleted,
  livingAndActivitySpacesDistributionReverted,
} from "@/features/create-project/core/urban-project/actions/urbanProject.actions";
import {
  selectLivingAndActivitySpacessDistribution,
  selectSpaceCategorySurfaceArea,
} from "@/features/create-project/core/urban-project/selectors/urbanProject.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import LivingAndActivitySpacesDistribution, {
  FormValues,
} from "./LivingAndActivitySpacesDistribution";

export default function LivingAndActivitySpacesDistributionContainer() {
  const dispatch = useAppDispatch();
  const livingAndActivitySpacesSurfaceArea = useAppSelector((state) =>
    selectSpaceCategorySurfaceArea(state, "LIVING_AND_ACTIVITY_SPACES"),
  );
  const livingAndActivitySpacesDistribution = useAppSelector(
    selectLivingAndActivitySpacessDistribution,
  );

  return (
    <LivingAndActivitySpacesDistribution
      initialValues={livingAndActivitySpacesDistribution.value}
      totalSurfaceArea={livingAndActivitySpacesSurfaceArea}
      onSubmit={(formData: FormValues) => {
        dispatch(livingAndActivitySpacesDistributionCompleted(formData));
      }}
      onBack={() => {
        dispatch(livingAndActivitySpacesDistributionReverted());
      }}
    />
  );
}
