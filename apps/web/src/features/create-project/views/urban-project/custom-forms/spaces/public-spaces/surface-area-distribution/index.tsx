import {
  publicSpacesDistributionCompleted,
  publicSpacesDistributionReverted,
} from "@/features/create-project/application/urban-project/urbanProject.actions";
import {
  selectPublicSpaces,
  selectSpaceCategorySurfaceArea,
} from "@/features/create-project/application/urban-project/urbanProject.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import PublicSpacesDistribution, { FormValues } from "./PublicSpacesDistribution";

export default function PublicSpacesDistributionContainer() {
  const dispatch = useAppDispatch();
  const publicSpaces = useAppSelector(selectPublicSpaces);
  const publicSpacesSurfaceArea = useAppSelector((state) =>
    selectSpaceCategorySurfaceArea(state, "PUBLIC_SPACES"),
  );

  return (
    <PublicSpacesDistribution
      publicSpaces={publicSpaces}
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
