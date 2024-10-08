import UrbanProjectSpaceCategoriesSurfaceAreaDistributionForm, {
  FormValues,
} from "./SpacesCategoriesSurfaceAreaDistributionForm";

import { selectSiteSurfaceArea } from "@/features/create-project/application/createProject.selectors";
import {
  spacesSurfaceAreaCompleted,
  spacesSurfaceAreaReverted,
} from "@/features/create-project/application/mixed-use-neighbourhood/mixedUseNeighbourhoodProject.actions";
import { selectSpacesCategories } from "@/features/create-project/application/mixed-use-neighbourhood/mixedUseNeighbourhoodProject.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

export default function UrbanProjectSpaceCategoriesSurfaceAreaDistributionContainer() {
  const dispatch = useAppDispatch();
  const totalSiteSurfaceArea = useAppSelector(selectSiteSurfaceArea);
  const selectedSpacesCategories = useAppSelector(selectSpacesCategories);

  return (
    <UrbanProjectSpaceCategoriesSurfaceAreaDistributionForm
      spacesCategories={selectedSpacesCategories}
      totalSurfaceArea={totalSiteSurfaceArea}
      onBack={() => {
        dispatch(spacesSurfaceAreaReverted());
      }}
      onSubmit={(data: FormValues) => {
        dispatch(spacesSurfaceAreaCompleted({ surfaceAreaDistribution: data }));
      }}
    />
  );
}
