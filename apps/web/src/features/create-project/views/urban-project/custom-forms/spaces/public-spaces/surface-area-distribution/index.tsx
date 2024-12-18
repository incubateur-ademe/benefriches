import {
  publicSpacesDistributionCompleted,
  publicSpacesDistributionReverted,
} from "@/features/create-project/application/urban-project/urbanProject.actions";
import { selectSpaceCategorySurfaceArea } from "@/features/create-project/application/urban-project/urbanProject.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import PublicSpacesDistribution, { FormValues } from "./PublicSpacesDistribution";

export default function PublicSpacesDistributionContainer() {
  const dispatch = useAppDispatch();
  const publicSpacesSurfaceArea = useAppSelector((state) =>
    selectSpaceCategorySurfaceArea(state, "PUBLIC_SPACES"),
  );

  return (
    <PublicSpacesDistribution
      totalSurfaceArea={publicSpacesSurfaceArea}
      onSubmit={(formData: FormValues) => {
        dispatch(publicSpacesDistributionCompleted(formData));
      }}
      onBack={() => {
        dispatch(publicSpacesDistributionReverted());
      }}
    />
  );
}
