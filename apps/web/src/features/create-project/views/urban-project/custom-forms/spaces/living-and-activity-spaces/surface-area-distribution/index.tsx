import {
  livingAndActivitySpacesDistributionCompleted,
  livingAndActivitySpacesDistributionReverted,
} from "@/features/create-project/application/urban-project/urbanProject.actions";
import { selectSpaceCategorySurfaceArea } from "@/features/create-project/application/urban-project/urbanProject.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import LivingAndActivitySpacesDistribution, {
  FormValues,
} from "./LivingAndActivitySpacesDistribution";

export default function LivingAndActivitySpacesDistributionContainer() {
  const dispatch = useAppDispatch();
  const livingAndActivitySpacesSurfaceArea = useAppSelector((state) =>
    selectSpaceCategorySurfaceArea(state, "LIVING_AND_ACTIVITY_SPACES"),
  );

  return (
    <LivingAndActivitySpacesDistribution
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
